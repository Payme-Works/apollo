import React from 'react';
import { FaUserAlt } from 'react-icons/fa';

import { Container } from './styles';

const Avatar: React.FC = () => {
  return (
    <Container>
      <FaUserAlt />
    </Container>
  );
};

export default Avatar;
