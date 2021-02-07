import React, { useCallback, useState } from 'react';

import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { useRobot } from '@/context/robot';

import { Container, Content } from './styles';

const Status: React.FC = () => {
  const [error, setError] = useState<string>();

  const { isRunning, start, stop } = useRobot();

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
            <Button onClick={handleStop}>Parar</Button>
          </>
        ) : (
          <>
            <p>O robô está parado. Deseja iniciar?</p>
            <Button onClick={handleStart}>Iniciar</Button>
          </>
        )}
      </Content>
    </Container>
  );
};

export default Status;
