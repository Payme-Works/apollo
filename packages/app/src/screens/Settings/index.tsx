import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@/components/Button';

import Broker from './Broker';
import MainAdjustments from './MainAdjustments';
import Management from './Management';

import { Container } from './styles';

const Settings: React.FC = () => {
  const history = useHistory();

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Container>
      <Broker />
      <MainAdjustments containerProps={{ style: { marginTop: 24 } }} />
      <Management />

      <Button
        variant="outline"
        onClick={handleGoBack}
        style={{ width: '100%', marginTop: 24 }}
      >
        Voltar
      </Button>

      <button type="button" id="restore">
        Restaurar padrão
      </button>
    </Container>
  );
};

export default Settings;
