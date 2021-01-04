import React, { createContext, useState, useContext, useCallback } from 'react';

import { subSeconds } from 'date-fns';

import { useAuthentication } from '@/context/authentication';
import { ISignalWithStatus, useSignals } from '@/context/signals';
import IOrder, { InstrumentType } from '@/interfaces/order/IOrder';
import {
  createOrder,
  ICreateOrderResponse,
} from '@/services/ares/order/CreateOrderService';
import { useMartingaleStrategy } from '@/services/ares/order/hooks/strategies/MartingaleStrategy';
import getActiveInfo from '@/utils/getActiveInfo';

interface ITask {
  signal_id: string;
  task: NodeJS.Timeout;
}

interface RobotContext {
  isRunning: boolean;
  start(): void;
  stop(): void;
}

const RobotContext = createContext<RobotContext | null>(null);

const RobotProvider: React.FC = ({ children }) => {
  const { signals, updateSignal } = useSignals();
  const { refreshProfile, setProfit } = useAuthentication();

  const [isRunning, setIsRunning] = useState(false);

  const [tasks, setTasks] = useState<ITask[]>([]);

  const createTask = useCallback(
    (signal: ISignalWithStatus) => {
      const dateLessThirtySeconds = subSeconds(signal.date, 30);

      let timeout = dateLessThirtySeconds.getTime() - Date.now();

      if (timeout <= 0) {
        updateSignal(signal.id, {
          status: 'passed',
        });

        return;
      }

      console.log(signal);

      const task: ITask = {
        signal_id: signal.id,
        task: setTimeout(async () => {
          if (signal.status === 'canceled') {
            updateSignal(signal.id, {
              status: 'passed',
              warning: 'Signal canceled',
            });

            return;
          }

          const activeInfo = await getActiveInfo(
            signal.active,
            signal.expiration,
          );

          let type: InstrumentType = 'binary';

          if (!activeInfo.binary.open) {
            type = 'digital';

            if (!activeInfo.digital.open) {
              updateSignal(signal.id, {
                status: 'passed',
                warning: 'Active closed',
              });

              return;
            }

            if (activeInfo.digital.profit > activeInfo.binary.profit) {
              type = 'digital';
            }
          }

          const activeProfit = activeInfo[type].profit;

          const dateLessThreeSeconds = subSeconds(signal.date, 3);

          timeout = dateLessThreeSeconds.getTime() - Date.now();

          setTimeout(async () => {
            updateSignal(signal.id, {
              status: 'in_progress',
            });

            const data: IOrder = {
              type,
              active: signal.active,
              price_amount: 2,
              action: signal.action,
              expiration: signal.expiration,
            };

            let order: ICreateOrderResponse;

            try {
              order = await createOrder(data);
            } catch (err) {
              updateSignal(signal.id, {
                status: 'passed',
                warning: 'Unexpected error while creating order',
              });

              console.error(err);
            }

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
                ({ profit: martingaleProfit, martingale, result, next }) => {
                  if (martingaleProfit * -1 + next.price_amount <= 5) {
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
                  martingale: martingaleAmount,
                  profit: finalProfit,
                },
              });
            } else {
              updateSignal(signal.id, {
                status: 'loss',
                result: {
                  martingale: martingaleAmount,
                  profit: finalProfit,
                },
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
    [setProfit, updateSignal],
  );

  const start = useCallback(() => {
    signals.forEach(signal => createTask(signal));

    setIsRunning(true);
  }, [createTask, signals]);

  const stop = useCallback(() => {
    signals.forEach(signal => {
      const findTask = tasks.find(task => task.signal_id === signal.id);

      if (findTask && signal.status === 'waiting') {
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
