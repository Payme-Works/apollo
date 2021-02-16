import React from 'react';

import Broker from './Broker';
import MainAdjustments from './MainAdjustments';

import { Container } from './styles';

const Settings: React.FC = () => {
  return (
    <Container>
      <Broker containerProps={{ style: { marginTop: 24 } }} />
      <MainAdjustments containerProps={{ style: { marginTop: 24 } }} />
    </Container>
  );
};

export default Settings;
