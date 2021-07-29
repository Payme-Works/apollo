import React from 'react';

import { Container, Label, Hint } from './styles';

interface IFormLabel {
  hint?: string;
}

const FormLabel: React.FC<IFormLabel> = ({ hint, children }) => {
  return (
    <Container id="form-label">
      <Label>{children}</Label>

      {hint && <Hint>{hint}</Hint>}
    </Container>
  );
};

export default FormLabel;
