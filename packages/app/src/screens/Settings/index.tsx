import React from 'react';

import Broker from './Broker';
import MainAdjustments from './MainAdjustments';

import { Container } from './styles';

const Settings: React.FC = () => {
  return (
    <Container>
      <Broker />
      <MainAdjustments containerProps={{ style: { marginTop: 24 } }} />
    </Container>
  );
};

export default Settings;
