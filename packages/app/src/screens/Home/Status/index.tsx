import React, { useCallback, useState } from 'react';

import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { useRobot } from '@/context/robot';

import { Container, Content } from './styles';

const Status: React.FC = () => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const { isRunning, start, stop } = useRobot();

  const handleStart = useCallback(() => {
    try {
      setIsLoading(true);

      setTimeout(() => start(), 500);
    } catch {
      setError('Ocorreu um erro ao tentar iniciar o robô.');
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [start]);

  const handleStop = useCallback(() => {
    try {
      setIsLoading(true);

      setTimeout(() => stop(), 500);
    } catch {
      setError('Ocorreu um erro ao tentar parar o robô.');
    } finally {
      setTimeout(() => setIsLoading(false), 500);
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

            <Button variant="outline" loading={isLoading} onClick={handleStop}>
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
};

export default Status;
