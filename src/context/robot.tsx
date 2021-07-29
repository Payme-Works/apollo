import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import {
  addMinutes,
  isWithinInterval,
  parseISO,
  subMinutes,
  subSeconds,
  isEqual,
} from 'date-fns';

import { useBrokerAuthentication } from '@/context/broker-authentication';
import { useSignals } from '@/context/signals';
import { useConfig } from '@/hooks/useConfig';
import IEvent from '@/interfaces/economic-calendar/IEvent';
import IOrder, { InstrumentType } from '@/interfaces/order/IOrder';
import IOrderResult from '@/interfaces/order/IOrderResult';
import ISignalWithStatus from '@/interfaces/signal/ISignalWithStatus';
import {
  createOrder,
  ICreateOrderResponse,
} from '@/services/ares/order/CreateOrderService';
import { useMartingaleStrategy } from '@/services/ares/order/hooks/strategies/MartingaleStrategy';
import Cache from '@/services/cache';
import koreApi from '@/services/kore/api';
import checkActionInFavorToTrend from '@/utils/checkActionInFavorToTrend';
import getActiveInfo, { IGetActiveInfoResponse } from '@/utils/getActiveInfo';
import getRandomInt from '@/utils/getRandomInt';

interface IRecoverLostOrder {
  profit: number;
}

interface ITask {
  signalId: string;
  tasks: {
    init: NodeJS.Timeout;
    createOrder?: NodeJS.Timeout;
  };
}

interface RobotContext {
  isRunning: boolean;
  isLoading: boolean;
  start(): void;
  stop(): void;
}

const RobotContext = createContext<RobotContext | null>(null);

const RobotProvider: React.FC = ({ children }) => {
  const [robotConfig] = useConfig('robot');

  const {
    signals,
    updateSignal,
    getSignalAvailableDate,
    isSignalAvailable,
    hasSignalResult,
  } = useSignals();
  const { refreshProfile, profit, setProfit } = useBrokerAuthentication();

  const checkerTasksRef = useRef<NodeJS.Timeout[]>([]);
  const tasksRef = useRef<ITask[]>([]);

  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (checkerTasksRef.current.length > 0) {
      checkerTasksRef.current.forEach(task => clearTimeout(task));

      checkerTasksRef.current = [];
    }

    if (isRunning) {
      return;
    }

    signals.forEach(signal => {
      const availableDate = getSignalAvailableDate(signal);

      const timeout = availableDate.getTime() - Date.now();

      const newCheckerTask = setTimeout(() => {
        if (isSignalAvailable(signal) || hasSignalResult(signal)) {
          return;
        }

        updateSignal(signal.id, {
          status: 'expired',
        });
      }, timeout);

      checkerTasksRef.current.push(newCheckerTask);
    });
  }, [
    getSignalAvailableDate,
    hasSignalResult,
    isRunning,
    isSignalAvailable,
    signals,
    updateSignal,
  ]);

  const stop = useCallback(() => {
    setIsLoading(true);

    setTimeout(() => {
      tasksRef.current.forEach(task => {
        const signal = signals.find(
          findSignal => findSignal.id === task.signalId,
        );

        if (signal.status === 'waiting' || signal.status === 'canceled') {
          clearTimeout(task.tasks.init);

          if (task.tasks.createOrder) {
            clearTimeout(task.tasks.createOrder);
          }

          const newTasks = tasksRef.current.filter(
            item => item.signalId === task.signalId,
          );

          tasksRef.current = newTasks;
        }
      });

      setIsLoading(false);
      setIsRunning(false);
    }, 500);
  }, [signals]);

  const createTask = useCallback(
    (signal: ISignalWithStatus) => {
      const availableDate = getSignalAvailableDate(signal);

      let timeout = availableDate.getTime() - Date.now();

      if (timeout <= 0) {
        return;
      }

      let createOrderTask: NodeJS.Timeout;

      const task: ITask = {
        signalId: signal.id,
        tasks: {
          init: setTimeout(async () => {
            if (signal.status === 'canceled') {
              updateSignal(signal.id, {
                status: 'expired',
                info: 'Sinal cancelado',
              });

              return;
            }

            const checkExpirationIsActive =
              robotConfig.current.filters.expirations.some(
                expiration => expiration.value === signal.expiration,
              );

            if (!checkExpirationIsActive) {
              updateSignal(signal.id, {
                status: 'expired',
                info: 'Expiração do sinal não listada nas configurações',
              });

              return;
            }

            const checkSomeSignalInProgress = signals.some(
              item => item.status === 'in_progress',
            );

            if (
              !robotConfig.current.filters.parallelOrders &&
              checkSomeSignalInProgress
            ) {
              updateSignal(signal.id, {
                status: 'expired',
                info: 'Algum sinal já em andamento',
              });

              return;
            }

            const checkSomeSignalWithSameDateAndExpiration = signals.some(
              item =>
                item.id !== signal.id &&
                isEqual(parseISO(item.date), parseISO(signal.date)) &&
                item.expiration === signal.expiration,
            );

            if (checkSomeSignalWithSameDateAndExpiration) {
              updateSignal(signal.id, {
                status: 'expired',
                info: 'Dois sinais com mesmo horário e expiração',
              });

              return;
            }

            let activeInfo: IGetActiveInfoResponse;

            try {
              activeInfo = await getActiveInfo(
                signal.currency,
                signal.expiration,
              );
            } catch {
              updateSignal(signal.id, {
                status: 'expired',
                info: 'Erro inesperado ao buscar informações do ativo',
              });

              return;
            }

            const configOperationType =
              robotConfig.current.filters.operationType.value;

            const availableInstrumentTypes: InstrumentType[] = [];
            let instrumentType: InstrumentType | undefined;

            if (
              activeInfo.binary.open &&
              (configOperationType === 'all' ||
                configOperationType === 'binary')
            ) {
              availableInstrumentTypes.push('binary');
            }

            if (
              activeInfo.digital.open &&
              (configOperationType === 'all' ||
                configOperationType === 'digital')
            ) {
              availableInstrumentTypes.push('digital');
            }

            if (availableInstrumentTypes.length === 0) {
              updateSignal(signal.id, {
                status: 'expired',
                info: 'Ativo fechado',
              });

              return;
            }

            if (
              activeInfo.digital.profit > activeInfo.binary.profit &&
              availableInstrumentTypes.includes('digital') &&
              availableInstrumentTypes.includes('binary')
            ) {
              instrumentType = 'digital';
            } else {
              [instrumentType] = availableInstrumentTypes;
            }

            const activeProfit = activeInfo[instrumentType].profit;

            if (activeProfit < robotConfig.current.filters.payout.minimum) {
              updateSignal(signal.id, {
                status: 'expired',
                info: `Payout do ativo menor do que o mínimo configurado (${activeProfit} < ${robotConfig.current.filters.payout.minimum})`,
              });

              return;
            }

            if (activeProfit > robotConfig.current.filters.payout.maximum) {
              updateSignal(signal.id, {
                status: 'expired',
                info: `Payout do ativo maior do que o mínimo configurado (${activeProfit} > ${robotConfig.current.filters.payout.maximum})`,
              });

              return;
            }

            if (robotConfig.current.filters.filterTrend) {
              const isActionInFavor = checkActionInFavorToTrend(
                signal.operation,
                activeInfo[instrumentType].trend,
              );

              if (!isActionInFavor) {
                updateSignal(signal.id, {
                  status: 'expired',
                  info: 'Sinal contra tendência do ativo',
                });

                return;
              }
            }

            if (robotConfig.current.economicEvents.filter) {
              try {
                const { data: events } = await koreApi.get<IEvent[]>(
                  '/economic-calendar/events',
                );

                const checkHasEvent = events
                  .filter(event =>
                    signal.currency
                      .toLowerCase()
                      .includes(event.economy.toLowerCase()),
                  )
                  .some(event => {
                    const dateParsed = parseISO(event.date);

                    const dateLessFifteenMinutes = subMinutes(
                      parseISO(signal.date),
                      robotConfig.current.economicEvents.minutes.before,
                    );
                    const datePlusFifteenMinutes = addMinutes(
                      parseISO(signal.date),
                      robotConfig.current.economicEvents.minutes.after,
                    );

                    return isWithinInterval(dateParsed, {
                      start: dateLessFifteenMinutes,
                      end: datePlusFifteenMinutes,
                    });
                  });

                if (checkHasEvent) {
                  updateSignal(signal.id, {
                    status: 'expired',
                    info: `Evento econômico em um intervalo de ${robotConfig.current.economicEvents.minutes.before}-${robotConfig.current.economicEvents.minutes.after} minutos`,
                  });

                  return;
                }
              } catch {
                updateSignal(signal.id, {
                  status: 'expired',
                  info: 'Erro inesperado ao buscar calendário de eventos',
                });

                return;
              }
            }

            const randomInt = getRandomInt(1, 100);

            if (
              robotConfig.current.filters.randomSkipSignals.active &&
              randomInt <
                robotConfig.current.filters.randomSkipSignals.chancePercentage
            ) {
              updateSignal(signal.id, {
                status: 'expired',
                info: 'Sinal pulado aleatóriamente',
              });

              return;
            }

            const dateLessThreeSeconds = subSeconds(parseISO(signal.date), 3);

            timeout = dateLessThreeSeconds.getTime() - Date.now();

            createOrderTask = setTimeout(async () => {
              updateSignal(signal.id, {
                status: 'in_progress',
              });

              let priceAmount = robotConfig.current.management.orderPrice.value;

              const differencePercentage = activeProfit / 100;

              let recoverLostOrder =
                Cache.get<IRecoverLostOrder>('recover-lost-order');

              console.log(signal, recoverLostOrder);

              let recoveringLostOrder = false;

              if (
                robotConfig.current.management.recoverLostOrder &&
                recoverLostOrder &&
                recoverLostOrder.profit < 0
              ) {
                const positiveLastProfit = recoverLostOrder.profit * -1;

                let recoveringPriceAmount =
                  positiveLastProfit / differencePercentage + priceAmount;

                if (
                  profit - priceAmount <=
                  -robotConfig.current.management.stopLoss.value
                ) {
                  recoveringPriceAmount /= 1.25;
                }

                priceAmount = recoveringPriceAmount;

                recoveringLostOrder = true;

                console.log(
                  signal,
                  `Duplicating order price, because previous order was lost: ${priceAmount}`,
                );

                Cache.set('recover-lost-order', null);
              }

              const signalsWithResult = signals.filter(
                item => item.status === 'win' || item.status === 'loss',
              );

              if (signalsWithResult.length === 1 /* TODO: add to config */) {
                priceAmount /= 1.5;
              }

              const data: IOrder = {
                type: instrumentType,
                active: signal.currency,
                price_amount: priceAmount,
                action: signal.operation,
                expiration: signal.expiration,
              };

              let order: ICreateOrderResponse;

              try {
                order = await createOrder(data);
              } catch (err) {
                updateSignal(signal.id, {
                  status: 'expired',
                  info: 'Erro inesperado ao criar ordem',
                });

                console.error(err);

                return;
              }

              refreshProfile();

              console.log(signal, data, order.order_id);

              let martingaleAmount = 0;

              let orderResult: IOrderResult;

              try {
                let maxMartingale = 0;

                if (robotConfig.current.management.martingale.active) {
                  maxMartingale =
                    robotConfig.current.management.martingale.amount;
                }

                orderResult = await order.use(
                  useMartingaleStrategy(
                    maxMartingale,
                    activeProfit,
                    robotConfig.current.management.orderPrice.value,
                    ({ martingale, result, next }) => {
                      let nextPriceAmount = next.price_amount;

                      if (
                        profit - next.price_amount <=
                        -robotConfig.current.management.stopLoss.value
                      ) {
                        nextPriceAmount /= 1.5;

                        console.log(
                          signal,
                          `[${martingale}] Changing next order price amount to: R$ ${nextPriceAmount}`,
                        );
                      }

                      if (
                        signalsWithResult.length === 1 /* TODO: add to config */
                      ) {
                        priceAmount /= 1.5;
                      }

                      next.setPriceAmount(nextPriceAmount);

                      martingaleAmount = martingale + 1;

                      if (martingale === 0) {
                        console.log(
                          signal,
                          `[${martingale}] Result: ${result}`,
                        );

                        return;
                      }

                      console.log(
                        signal,
                        `[${martingale}] Martingale result: ${result}`,
                      );
                    },
                    () => {
                      refreshProfile();
                    },
                  ),
                );
              } catch (err) {
                updateSignal(signal.id, {
                  status: 'expired',
                  info: 'Erro inesperado ao criar ordem do martingale',
                });

                console.error(err);

                return;
              }

              console.log(
                signal,
                `[${martingaleAmount}] Final result: ${
                  orderResult.result
                } (R$ ${orderResult.profit.toFixed(2)})`,
                '\n',
              );

              console.log(orderResult);

              setProfit(state => {
                const newProfit = state + orderResult.profit;

                if (
                  newProfit <= -robotConfig.current.management.stopLoss.value ||
                  newProfit >= robotConfig.current.management.stopGain.value
                ) {
                  stop();
                  console.log('stop');
                }

                return newProfit;
              });

              let info: string;

              if (recoveringLostOrder) {
                info = 'Ordem de recuperação da derrota anterior';
              }

              if (orderResult.result === 'win') {
                updateSignal(signal.id, {
                  status: 'win',
                  result: {
                    martingales: martingaleAmount,
                    profit: orderResult.profit,
                  },
                  info,
                });
              } else {
                updateSignal(signal.id, {
                  status: 'loss',
                  result: {
                    martingales: martingaleAmount,
                    profit: orderResult.profit,
                  },
                  info,
                });
              }

              recoverLostOrder =
                Cache.get<IRecoverLostOrder>('recover-lost-order');

              if (orderResult.result === 'loose' && orderResult.profit < 0) {
                let recoverProfit = orderResult.profit;

                if (
                  priceAmount > robotConfig.current.management.orderPrice.value
                ) {
                  recoverProfit += priceAmount;
                }

                Cache.set<IRecoverLostOrder>('recover-lost-order', {
                  profit: recoverProfit,
                });
              }

              await refreshProfile();
            }, timeout);
          }, timeout),
          createOrder: createOrderTask,
        },
      };

      tasksRef.current = [...tasksRef.current, task];

      updateSignal(signal.id, {
        status: 'waiting',
      });
    },
    [
      getSignalAvailableDate,
      updateSignal,
      robotConfig,
      signals,
      refreshProfile,
      profit,
      setProfit,
      stop,
    ],
  );

  const start = useCallback(() => {
    setIsLoading(true);

    setTimeout(() => {
      signals.forEach(signal => createTask(signal));

      setIsLoading(false);
      setIsRunning(true);
    }, 500);
  }, [createTask, signals]);

  return (
    <RobotContext.Provider
      value={{
        isRunning,
        isLoading,
        start,
        stop,
      }}
    >
      {children}
    </RobotContext.Provider>
  );
};

function useRobot(): RobotContext {
  const context = useContext(RobotContext);

  if (!context) {
    throw new Error("'useRobot' must be used within a 'RobotProvider'");
  }

  return context;
}

export { RobotProvider, useRobot };
