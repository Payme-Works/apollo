import React, { useMemo } from 'react';

import { Container } from './styles';

interface IFormControl extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  hint?: string;
}

export function FormControl({
  disabled = false,
  hint,
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

      <p>{hint}</p>
    </Container>
  );
}
