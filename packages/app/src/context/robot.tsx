import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { parseISO, subSeconds } from 'date-fns';

import { useBrokerAuthentication } from '@/context/broker-authentication';
import { useSignals } from '@/context/signals';
import IOrder, { InstrumentType } from '@/interfaces/order/IOrder';
import ISignalWithStatus from '@/interfaces/signal/ISignalWithStatus';
import {
  createOrder,
  ICreateOrderResponse,
} from '@/services/ares/order/CreateOrderService';
import { useMartingaleStrategy } from '@/services/ares/order/hooks/strategies/MartingaleStrategy';
import Cache from '@/services/cache';
import getActiveInfo from '@/utils/getActiveInfo';

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
              warning: 'Signal canceled',
            });

            return;
          }

          const activeInfo = await getActiveInfo(
            signal.currency,
            signal.expiration,
          );

          let type: InstrumentType = 'binary';

          if (!activeInfo.binary.open) {
            type = 'digital';

            if (!activeInfo.digital.open) {
              updateSignal(signal.id, {
                status: 'expired',
                warning: 'Active closed',
              });

              return;
            }

            if (activeInfo.digital.profit > activeInfo.binary.profit) {
              type = 'digital';
            }
          }

          const activeProfit = activeInfo[type].profit;

          updateSignal(signal.id, {
            status: 'in_progress',
          });

          const dateLessThreeSeconds = subSeconds(parseISO(signal.date), 3);

          timeout = dateLessThreeSeconds.getTime() - Date.now();

          setTimeout(async () => {
            let priceAmount = 1000; /* PRICE AMOUNT */

            const differencePercentage = activeProfit / 100;

            let recoverLostOrder = Cache.get<IRecoverLostOrder>(
              'recover-lost-order',
            );

            console.log(signal, recoverLostOrder);

            if (recoverLostOrder && recoverLostOrder.profit < 0) {
              const positiveLastProfit = recoverLostOrder.profit * -1;

              priceAmount = Number(
                positiveLastProfit / differencePercentage + priceAmount,
              );

              if (profit - priceAmount <= -10000 /* STOP LOSS */) {
                priceAmount /= 1.5;
              }

              console.log(
                signal,
                `Duplicating order price, because previous order was lost: ${priceAmount}`,
              );

              Cache.set('recover-lost-order', null);
            }

            const data: IOrder = {
              type,
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
                warning: 'Unexpected error while creating order',
              });

              console.error(err);

              return;
            }

            refreshProfile();

            console.log(signal, data, order.order_id);

            let martingaleAmount = 0;

            const {
              result: finalResult,
              profit: finalProfit,
            } = await order.use(
              useMartingaleStrategy(
                1,
                activeProfit,
                2,
                ({ martingale, result, next }) => {
                  if (profit - next.price_amount <= -10000 /* STOP LOSS */) {
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

            console.log(
              signal,
              `[${martingaleAmount}] Final result: ${finalResult} (R$ ${finalProfit.toFixed(
                2,
              )})`,
              '\n',
            );

            if (finalResult === 'win') {
              updateSignal(signal.id, {
                status: 'win',
                result: {
                  martingales: martingaleAmount,
                  profit: finalProfit,
                },
              });
            } else {
              updateSignal(signal.id, {
                status: 'loss',
                result: {
                  martingales: martingaleAmount,
                  profit: finalProfit,
                },
              });
            }

            recoverLostOrder = Cache.get<IRecoverLostOrder>(
              'recover-lost-order',
            );

            if (finalProfit < 0) {
              let recoverProfit = finalProfit;

              if (priceAmount > 1000 /* PRICE AMOUNT */) {
                recoverProfit += priceAmount;
              }

              Cache.set<IRecoverLostOrder>('recover-lost-order', {
                profit: recoverProfit,
              });
            }

            setProfit(state => state + finalProfit);

            await refreshProfile();
          }, timeout);
        }, timeout),
      };

      setTasks(state => [...state, task]);

      updateSignal(signal.id, {
        status: 'waiting',
      });
    },
    [getSignalAvailableDate, profit, refreshProfile, setProfit, updateSignal],
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
