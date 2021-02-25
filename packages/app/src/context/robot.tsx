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
import getActiveInfo from '@/utils/getActiveInfo';
import getRandomInt from '@/utils/getRandomInt';

interface IRecoverLostOrder {
  profit: number;
}

interface ITask {
  signal_id: string;
  task: NodeJS.Timeout;
}

interface RobotContext {
  isRunning: boolean;
  start(): void;
  stop(): void;
}

/* const NOT_AVAILABLE_SIGNAL_STATUS: Status[] = [
  'expired',
  'in_progress',
  'win',
  'loss',
]; */

const RobotContext = createContext<RobotContext | null>(null);

const RobotProvider: React.FC = ({ children }) => {
  const robotConfig = useConfig('robot');

  const {
    signals,
    updateSignal,
    getSignalAvailableDate,
    isSignalAvailable,
    hasSignalResult,
  } = useSignals();
  const { refreshProfile, profit, setProfit } = useBrokerAuthentication();

  const checkerTasksRef = useRef<NodeJS.Timeout[]>([]);

  const [isRunning, setIsRunning] = useState(false);

  const [tasks, setTasks] = useState<ITask[]>([]);

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

  const createTask = useCallback(
    (signal: ISignalWithStatus) => {
      const availableDate = getSignalAvailableDate(signal);

      let timeout = availableDate.getTime() - Date.now();

      if (timeout <= 0) {
        return;
      }

      const task: ITask = {
        signal_id: signal.id,
        task: setTimeout(async () => {
          if (signal.status === 'canceled') {
            updateSignal(signal.id, {
              status: 'expired',
              info: 'Sinal cancelado',
            });

            return;
          }

          const checkExpirationIsActive = robotConfig.filters.expirations.some(
            expiration => expiration.value === signal.expiration,
          );

          if (!checkExpirationIsActive) {
            updateSignal(signal.id, {
              status: 'expired',
              info: 'Expiração do sinal não listada nas configurações',
            });

            return;
          }

          const randomInt = getRandomInt(0, 100);

          if (
            randomInt < robotConfig.filters.randomSkipSignals.chancePercentage
          ) {
            updateSignal(signal.id, {
              status: 'expired',
              info: 'Sinal pulado aleatóriamente',
            });

            return;
          }

          const activeInfo = await getActiveInfo(
            signal.currency,
            signal.expiration,
          );

          const configOperationType = robotConfig.filters.operationType.value;

          const availableInstrumentTypes: InstrumentType[] = [];
          let instrumentType: InstrumentType | undefined;

          if (
            activeInfo.binary.open &&
            (configOperationType === 'all' || configOperationType === 'binary')
          ) {
            availableInstrumentTypes.push('binary');
          }

          if (
            activeInfo.digital.open &&
            (configOperationType === 'all' || configOperationType === 'digital')
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
            instrumentType = 'binary';
          }

          const activeProfit = activeInfo[instrumentType].profit;

          if (activeProfit < robotConfig.filters.payout.minimum) {
            updateSignal(signal.id, {
              status: 'expired',
              info: 'Payout do ativo menor do que o mínimo configurado',
            });

            return;
          }

          if (activeProfit > robotConfig.filters.payout.maximum) {
            updateSignal(signal.id, {
              status: 'expired',
              info: 'Payout do ativo maior do que o mínimo configurado',
            });

            return;
          }

          if (robotConfig.filters.filterTrend) {
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

          if (robotConfig.economicEvents.filter) {
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
                  robotConfig.economicEvents.minutes.before,
                );
                const datePlusFifteenMinutes = addMinutes(
                  parseISO(signal.date),
                  robotConfig.economicEvents.minutes.after,
                );

                return isWithinInterval(dateParsed, {
                  start: dateLessFifteenMinutes,
                  end: datePlusFifteenMinutes,
                });
              });

            if (checkHasEvent) {
              updateSignal(signal.id, {
                status: 'expired',
                info: `Evento econômico em um intervalo de ${robotConfig.economicEvents.minutes.before}-${robotConfig.economicEvents.minutes.after}`,
              });

              return;
            }
          }

          updateSignal(signal.id, {
            status: 'in_progress',
          });

          const dateLessThreeSeconds = subSeconds(parseISO(signal.date), 3);

          timeout = dateLessThreeSeconds.getTime() - Date.now();

          setTimeout(async () => {
            let priceAmount = robotConfig.management.orderPrice.value;

            const differencePercentage = activeProfit / 100;

            let recoverLostOrder = Cache.get<IRecoverLostOrder>(
              'recover-lost-order',
            );

            console.log(signal, recoverLostOrder);

            if (
              robotConfig.management.recoverLostOrder &&
              recoverLostOrder &&
              recoverLostOrder.profit < 0
            ) {
              const positiveLastProfit = recoverLostOrder.profit * -1;

              priceAmount = Number(
                positiveLastProfit / differencePercentage + priceAmount,
              );

              if (
                profit - priceAmount <=
                -robotConfig.management.stopLoss.value
              ) {
                priceAmount /= 1.5;
              }

              console.log(
                signal,
                `Duplicating order price, because previous order was lost: ${priceAmount}`,
              );

              Cache.set('recover-lost-order', null);
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

              if (robotConfig.management.martingale.active) {
                maxMartingale = robotConfig.management.martingale.amount;
              }

              orderResult = await order.use(
                useMartingaleStrategy(
                  maxMartingale,
                  activeProfit,
                  robotConfig.management.orderPrice.value,
                  ({ martingale, result, next }) => {
                    if (
                      profit - next.price_amount <=
                      -robotConfig.management.stopLoss.value
                    ) {
                      const nextPriceAmount = next.price_amount / 1.5;

                      next.setPriceAmount(nextPriceAmount);

                      console.log(
                        signal,
                        `[${martingale}] Changing next order price amount to: R$ ${nextPriceAmount}`,
                      );
                    }

                    martingaleAmount = martingale + 1;

                    if (martingale === 0) {
                      console.log(signal, `[${martingale}] Result: ${result}`);

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

            if (orderResult.result === 'win') {
              updateSignal(signal.id, {
                status: 'win',
                result: {
                  martingales: martingaleAmount,
                  profit: orderResult.profit,
                },
              });
            } else {
              updateSignal(signal.id, {
                status: 'loss',
                result: {
                  martingales: martingaleAmount,
                  profit: orderResult.profit,
                },
              });
            }

            recoverLostOrder = Cache.get<IRecoverLostOrder>(
              'recover-lost-order',
            );

            if (orderResult.profit < 0) {
              let recoverProfit = orderResult.profit;

              if (priceAmount > robotConfig.management.orderPrice.value) {
                recoverProfit += priceAmount;
              }

              Cache.set<IRecoverLostOrder>('recover-lost-order', {
                profit: recoverProfit,
              });
            }

            setProfit(state => state + orderResult.profit);

            await refreshProfile();
          }, timeout);
        }, timeout),
      };

      setTasks(state => [...state, task]);

      updateSignal(signal.id, {
        status: 'waiting',
      });
    },
    [
      getSignalAvailableDate,
      profit,
      refreshProfile,
      setProfit,
      updateSignal,
      robotConfig,
    ],
  );

  const start = useCallback(() => {
    signals.forEach(signal => createTask(signal));

    setIsRunning(true);
  }, [createTask, signals]);

  const stop = useCallback(() => {
    signals.forEach(signal => {
      const findTask = tasks.find(task => task.signal_id === signal.id);

      if (
        findTask &&
        (signal.status === 'waiting' || signal.status === 'canceled')
      ) {
        clearTimeout(findTask.task);

        const newTasks = tasks.filter(task => task.signal_id === signal.id);

        setTasks(newTasks);
      }
    });

    setIsRunning(false);
  }, [signals, tasks]);

  return (
    <RobotContext.Provider
      value={{
        isRunning,
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
