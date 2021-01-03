import React, { createContext, useState, useContext, useCallback } from 'react';

import { subSeconds } from 'date-fns';

import { ISignalWithStatus, Status, useSignals } from '@/context/signals';
import getRandomInt from '@/utils/getRandomInt';

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

  const [isRunning, setIsRunning] = useState(false);

  const [tasks, setTasks] = useState<ITask[]>([]);

  const createTask = useCallback(
    (signal: ISignalWithStatus) => {
      const now = new Date();
      const dateLessThirtySeconds = subSeconds(signal.date, 30);

      const timeout = dateLessThirtySeconds.getTime() - now.getTime();

      if (timeout <= 0) {
        updateSignal(signal.id, {
          status: 'passed',
        });

        return;
      }

      console.log(signal);

      const task: ITask = {
        signal_id: signal.id,
        task: setTimeout(() => {
          if (signal.status === 'canceled') {
            updateSignal(signal.id, {
              status: 'passed',
            });

            return;
          }

          updateSignal(signal.id, {
            status: 'in_progress',
          });

          // queueSignal(signal);

          setTimeout(() => {
            const randomInt = getRandomInt(0, 100);

            let result: Status = 'loss';

            if (randomInt % 2) {
              result = 'win';
            }

            updateSignal(signal.id, {
              status: result,
            });

            console.log(signal);
          }, 10000);
        }, timeout),
      };

      setTasks(state => [...state, task]);

      updateSignal(signal.id, {
        status: 'waiting',
      });
    },
    [updateSignal],
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
