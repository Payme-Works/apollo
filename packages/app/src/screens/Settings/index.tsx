import React from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import { AnimationContainer } from './styles';

const Setings: React.FC = () => {
  const history = useHistory();

  return (
    <AnimationContainer>
      <FiChevronLeft onClick={history.goBack} />
      <h1 style={{ textAlign: 'center' }}>Settings</h1>
    </AnimationContainer>
  );
};

export default Setings;
