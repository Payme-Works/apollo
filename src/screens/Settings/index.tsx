import React, { useCallback } from 'react';

import { useHistory } from 'react-router-dom';

import Button from '@/components/Button';
import EconomicEvents from '@/screens/Settings/EconomicEvents';

import Application from './Application';
import Broker from './Broker';
import Filters from './Filters';
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

      <Management style={{ marginTop: 24 }} />

      <Filters style={{ marginTop: 24 }} />

      <EconomicEvents style={{ marginTop: 24 }} />

      <Application style={{ marginTop: 24 }} />

      <Button
        onClick={handleGoBack}
        style={{ width: '100%', marginTop: 24 }}
        variant="outline"
      >
        Voltar
      </Button>

      <button id="restore" type="button">
        Restaurar padrão
      </button>
    </Container>
  );
};

export default Settings;
