import React, { useCallback, useState } from 'react';

import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { useRobot } from '@/context/RobotContext';

import { Container, Content } from './styles';

export function Status() {
  const [error, setError] = useState<string>();

  const { isRunning, isLoading, start, stop } = useRobot();

  const handleStart = useCallback(() => {
    try {
      start();
    } catch {
      setError('Ocorreu um erro ao tentar iniciar o robô.');
    }
  }, [start]);

  const handleStop = useCallback(() => {
    try {
      stop();
    } catch {
      setError('Ocorreu um erro ao tentar parar o robô.');
    }
  }, [stop]);

  return (
    <Container>
      {error && (
        <Badge
          closeable
          onClose={() => {
            setError(null);
          }}
        >
          {error}
        </Badge>
      )}

      <Content>
        {isRunning ? (
          <>
            <p>O robô está em execução.</p>

            <Button loading={isLoading} onClick={handleStop} variant="outline">
              Parar
            </Button>
          </>
        ) : (
          <>
            <p>O robô está parado. Deseja iniciar?</p>

            <Button loading={isLoading} onClick={handleStart}>
              Iniciar
            </Button>
          </>
        )}
      </Content>
    </Container>
  );
}
