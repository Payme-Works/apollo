import React, { useMemo } from 'react';

import { Container } from './styles';

interface IFormControl extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

export function FormControl({
  disabled = false,
  children,
  ...rest
}: IFormControl) {
  const childrenWithProps = useMemo(
    () =>
      React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { disabled });
        }

        return child;
      }),
    [children, disabled],
  );

  return (
    <Container {...rest} disabled={disabled}>
      {childrenWithProps}
    </Container>
  );
}
