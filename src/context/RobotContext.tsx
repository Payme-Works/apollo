import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { Active, ExpirationPeriod, InstrumentType } from '@hemes/iqoption';
import {
  addMinutes,
  isWithinInterval,
  parseISO,
  subMinutes,
  subSeconds,
  Interval,
} from 'date-fns';

import { useHemes } from '@/context/HemesContext';
import { useProfile } from '@/context/ProfileContext';
import { useSignals } from '@/context/SignalsContext';
import { SignalTaskError } from '@/errors/SignalTaskError';
import { useConfig } from '@/hooks/useConfig';
import { EconomicCalendarEvent } from '@/interfaces/economic-calendar/EconomicCalendarEvent';
import { ClosedPosition } from '@/interfaces/positions/ClosedPosition';
import { SimpleInstrumentType } from '@/interfaces/positions/SimpleInstrumentType';
import { SignalWithStatus } from '@/interfaces/signals/SignalWithStatus';
import { Cache } from '@/services/cache';
import { useMartingaleStrategy } from '@/services/hemes/positions/hooks/strategies/MartingaleStrategy';
import {
  openPosition,
  OpenPositionResponse,
} from '@/services/hemes/positions/OpenPositionService';
import { koreApi } from '@/services/kore/api';
import { getRandomInt } from '@/utils/getRandomInt';

type ActiveEnabledByInstrumentType = {
  [instrumentType in SimpleInstrumentType]: boolean;
};

type ActiveProfitByInstrumentType = {
  [instrumentType in SimpleInstrumentType]: number;
};

interface ITask {
  signalId: string;
  tasks: {
    init: NodeJS.Timeout;
    openPosition?: NodeJS.Timeout;
  };
}

interface IRecoverLostOrder {
  profit: number;
}

interface RobotContextData {
  isRunning: boolean;
  isLoading: boolean;
  start(): void;
  stop(): void;
}

const RobotContext = createContext<RobotContextData>({} as RobotContextData);

export function RobotContextProvider({ children }) {
  const [robotConfig] = useConfig('robot');

  const {
    signals,
    updateSignal,
    getSignalAvailableDate,
    isSignalAvailable,
    hasSignalResult,
  } = useSignals();
  const { profit, setProfit } = useProfile();
  const { hemes, refreshProfile } = useHemes();

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

          if (task.tasks.openPosition) {
            clearTimeout(task.tasks.openPosition);
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
    (signal: SignalWithStatus) => {
      const availableDate = getSignalAvailableDate(signal);

      const signalTimeout = availableDate.getTime() - Date.now();

      if (signalTimeout <= 0) {
        return;
      }

      async function getActiveEnabledByInstrumentType(
        active: Active,
        expiration: ExpirationPeriod,
      ): Promise<ActiveEnabledByInstrumentType> {
        try {
          let instrumentType: InstrumentType = 'binary-option';

          if (expiration === 'm1') {
            instrumentType = 'turbo-option';
          }

          const [binary, digital] = await Promise.allSettled([
            hemes.isActiveEnabled(active, instrumentType, expiration),
            hemes.isActiveEnabled(active, 'digital-option'),
          ]);

          return {
            binary: binary.status === 'fulfilled' ? binary.value : false,
            digital: digital.status === 'fulfilled' ? digital.value : false,
          };
        } catch (error) {
          throw new SignalTaskError({
            signal,
            status: 'expired',
            info: 'Erro inesperado ao buscar disponibilidade do ativo',
          });
        }
      }

      async function getActiveProfitByInstrumentType(
        active: Active,
        expiration: ExpirationPeriod,
      ): Promise<ActiveProfitByInstrumentType> {
        try {
          let instrumentType: InstrumentType = 'binary-option';

          if (expiration === 'm1') {
            instrumentType = 'turbo-option';
          }

          const [binary, digital] = await Promise.allSettled([
            hemes.getActiveProfit(active, instrumentType, expiration),
            hemes.getActiveProfit(active, 'digital-option'),
          ]);

          return {
            binary: binary.status === 'fulfilled' ? binary.value : 0,
            digital: digital.status === 'fulfilled' ? digital.value : 0,
          };
        } catch (error) {
          throw new SignalTaskError({
            signal,
            status: 'expired',
            info: 'Erro inesperado ao buscar cotação do ativo',
          });
        }
      }

      async function checkHasEconomicCalendarEventWithinMinutes(
        active: Active,
        interval: Interval,
      ): Promise<boolean> {
        try {
          const { data: events } = await koreApi.get<EconomicCalendarEvent[]>(
            '/economic-calendar/events',
          );

          const hasEconomicCalendarEvent = events
            .filter(event =>
              active.toLowerCase().includes(event.economy.toLowerCase()),
            )
            .some(event => {
              const dateParsed = parseISO(event.date);

              return isWithinInterval(dateParsed, interval);
            });

          return hasEconomicCalendarEvent;
        } catch {
          throw new SignalTaskError({
            signal,
            status: 'expired',
            info: 'Erro inesperado ao buscar calendário de eventos',
          });
        }
      }

      let openPositionTask: NodeJS.Timeout;

      const task: ITask = {
        signalId: signal.id,
        tasks: {
          init: setTimeout(async () => {
            try {
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
                  info: 'Outro sinal já em andamento',
                });

                return;
              }

              /* const checkSomeSignalWithSameDateAndExpiration = signals.some(
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
              } */

              const activeEnabledByInstrumentType =
                await getActiveEnabledByInstrumentType(
                  signal.active,
                  signal.expiration,
                );

              const configInstrumentType =
                robotConfig.current.filters.instrumentType.value;

              const availableInstrumentTypes: SimpleInstrumentType[] = [];
              let instrumentType: SimpleInstrumentType | undefined;

              const isFilteredByBinaryInstrumentType =
                configInstrumentType === 'all' ||
                configInstrumentType === 'binary';

              if (
                activeEnabledByInstrumentType.binary &&
                isFilteredByBinaryInstrumentType
              ) {
                availableInstrumentTypes.push('binary');
              }

              const isFilteredByDigitalInstrumentType =
                configInstrumentType === 'all' ||
                configInstrumentType === 'digital';

              if (
                activeEnabledByInstrumentType.digital &&
                isFilteredByDigitalInstrumentType
              ) {
                availableInstrumentTypes.push('digital');
              }

              if (availableInstrumentTypes.length === 0) {
                throw new SignalTaskError({
                  signal,
                  status: 'expired',
                  info: 'Ativo não disponível',
                });
              }

              const activeProfitByInstrumentType =
                await getActiveProfitByInstrumentType(
                  signal.active,
                  signal.expiration,
                );

              if (
                availableInstrumentTypes.includes('digital') &&
                availableInstrumentTypes.includes('binary') &&
                activeProfitByInstrumentType.digital >
                  activeProfitByInstrumentType.binary
              ) {
                instrumentType = 'digital';
              } else {
                [instrumentType] = availableInstrumentTypes;
              }

              const activeProfit = activeProfitByInstrumentType[instrumentType];

              if (activeProfit < robotConfig.current.filters.payout.minimum) {
                throw new SignalTaskError({
                  signal,
                  status: 'expired',
                  info: `Ativo com cotação abaixa do mínimo configurado (${activeProfit} < ${robotConfig.current.filters.payout.minimum})`,
                });
              }

              if (activeProfit > robotConfig.current.filters.payout.maximum) {
                throw new SignalTaskError({
                  signal,
                  status: 'expired',
                  info: `Ativo com cotação acima do máximo configurado (${activeProfit} > ${robotConfig.current.filters.payout.maximum})`,
                });
              }

              /* TODO: implement get active trend on @hemes
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
              } */

              if (robotConfig.current.economicEvents.filter) {
                const dateLessConfiguredMinutes = subMinutes(
                  parseISO(signal.date),
                  robotConfig.current.economicEvents.minutes.before,
                );

                const datePlusConfiguredMinutes = addMinutes(
                  parseISO(signal.date),
                  robotConfig.current.economicEvents.minutes.after,
                );

                const hasEconomicCalendarEvent =
                  await checkHasEconomicCalendarEventWithinMinutes(
                    signal.active,
                    {
                      start: dateLessConfiguredMinutes,
                      end: datePlusConfiguredMinutes,
                    },
                  );

                if (hasEconomicCalendarEvent) {
                  throw new SignalTaskError({
                    signal,
                    status: 'expired',
                    info: `Evento econômico em um intervalo de ${robotConfig.current.economicEvents.minutes.before} <> ${robotConfig.current.economicEvents.minutes.after} minutos`,
                  });
                }
              }

              const randomInt = getRandomInt(1, 100);

              if (
                robotConfig.current.filters.randomSkipSignals.active &&
                randomInt <
                  robotConfig.current.filters.randomSkipSignals.chancePercentage
              ) {
                throw new SignalTaskError({
                  signal,
                  status: 'expired',
                  info: 'Sinal pulado aleatóriamente',
                });
              }

              const dateLessThreeSeconds = subSeconds(parseISO(signal.date), 3);

              const createOrderTimeout =
                dateLessThreeSeconds.getTime() - Date.now();

              openPositionTask = setTimeout(async () => {
                try {
                  updateSignal(signal.id, {
                    status: 'in_progress',
                  });

                  let priceAmount =
                    robotConfig.current.management.orderPrice.value;

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

                  // const signalsWithResult = signals.filter(
                  //   item => item.status === 'win' || item.status === 'loss',
                  // );

                  // if (signalsWithResult.length === 1 /* TODO: add to config */) {
                  //   priceAmount /= 1.5;
                  // }

                  let openPositionResponse: OpenPositionResponse;

                  try {
                    openPositionResponse = await openPosition(hemes, {
                      instrument_type: instrumentType,
                      active: signal.active,
                      price: priceAmount,
                      direction: signal.direction,
                      expiration_period: signal.expiration,
                    });
                  } catch (err) {
                    throw new SignalTaskError({
                      signal,
                      status: 'expired',
                      info: 'Erro inesperado ao abrir posição',
                    });
                  }

                  refreshProfile();

                  let martingaleAmount = 0;

                  let closedPosition: ClosedPosition;

                  try {
                    let maxMartingale = 0;

                    if (robotConfig.current.management.martingale.active) {
                      maxMartingale =
                        robotConfig.current.management.martingale.amount;
                    }

                    const [position, usePositionHook] = openPositionResponse;

                    console.log(
                      signal,
                      {
                        instrumentType,
                        active: signal.active,
                        priceAmount,
                        direction: signal.direction,
                        expiration: signal.expiration,
                      },
                      position.id,
                    );

                    closedPosition = await usePositionHook(
                      useMartingaleStrategy(
                        maxMartingale,
                        activeProfit,
                        robotConfig.current.management.orderPrice.value,
                        ({ martingale, result, next }) => {
                          let nextPrice = next.price;

                          if (
                            profit - next.price <=
                            -robotConfig.current.management.stopLoss.value
                          ) {
                            nextPrice /= 1.25;

                            console.log(
                              signal,
                              `[${martingale}] Changing next position price to: R$ ${nextPrice}`,
                            );
                          }

                          /* if (
                          signalsWithResult.length ===
                          1 TODO: add to config and analyse if makes sense
                        ) {
                          priceAmount /= 1.5;
                        } */

                          next.setPrice(nextPrice);

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
                      closedPosition.result
                    } (R$ ${closedPosition.profit.toFixed(2)})`,
                    '\n',
                  );

                  console.log(closedPosition);

                  setProfit(state => {
                    const newProfit = state + closedPosition.profit;

                    if (
                      newProfit <=
                        -robotConfig.current.management.stopLoss.value ||
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

                  if (closedPosition.result === 'win') {
                    updateSignal(signal.id, {
                      status: 'win',
                      result: {
                        martingales: martingaleAmount,
                        profit: closedPosition.profit,
                      },
                      info,
                    });
                  } else {
                    updateSignal(signal.id, {
                      status: 'loss',
                      result: {
                        martingales: martingaleAmount,
                        profit: closedPosition.profit,
                      },
                      info,
                    });
                  }

                  recoverLostOrder =
                    Cache.get<IRecoverLostOrder>('recover-lost-order');

                  if (
                    closedPosition.result === 'loss' &&
                    closedPosition.profit < 0
                  ) {
                    let recoverProfit = closedPosition.profit;

                    if (
                      priceAmount >
                      robotConfig.current.management.orderPrice.value
                    ) {
                      recoverProfit += priceAmount;
                    }

                    Cache.set<IRecoverLostOrder>('recover-lost-order', {
                      profit: recoverProfit,
                    });
                  }

                  refreshProfile();
                } catch (error) {
                  if (error instanceof SignalTaskError) {
                    updateSignal(signal.id, {
                      status: error.status,
                      info: error.info,
                    });

                    return;
                  }

                  updateSignal(signal.id, {
                    status: 'expired',
                    info: 'Desculpe, ocorreu um erro inesperado',
                  });
                }
              }, createOrderTimeout);
            } catch (error) {
              if (error instanceof SignalTaskError) {
                updateSignal(signal.id, {
                  status: error.status,
                  info: error.info,
                });

                return;
              }

              updateSignal(signal.id, {
                status: 'expired',
                info: 'Desculpe, ocorreu um erro inesperado',
              });
            }
          }, signalTimeout),
          openPosition: openPositionTask,
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
      hemes,
      robotConfig,
      signals,
      refreshProfile,
      setProfit,
      profit,
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
}

export function useRobot(): RobotContextData {
  const context = useContext(RobotContext);

  if (!context) {
    throw new Error("'useRobot' must be used within a 'RobotContextProvider'");
  }

  return context;
}
