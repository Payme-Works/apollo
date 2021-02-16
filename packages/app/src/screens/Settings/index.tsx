import React from 'react';

import Switch from '@/components/Form/Switch';

import Broker from './Broker';
import MainAdjustments from './MainAdjustments';

import { Container } from './styles';

const Settings: React.FC = () => {
  return (
    <Container>
      <Switch name="switch" label />

      <Broker containerProps={{ style: { marginTop: 24 } }} />
      <MainAdjustments containerProps={{ style: { marginTop: 24 } }} />
    </Container>
  );
};

export default Settings;
