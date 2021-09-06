import React, { ReactNode } from 'react';

import { Container, Label, Hint } from './styles';

interface IFormLabel {
  hint?: string;
  children: ReactNode;
}

export function FormLabel({ hint, children }: IFormLabel) {
  return (
    <Container id="form-label">
      <Label>{children}</Label>

      {hint && <Hint>{hint}</Hint>}
    </Container>
  );
}
