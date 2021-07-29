import React, { useMemo } from 'react';

import { Container } from './styles';

interface IFormControl extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

const FormControl: React.FC<IFormControl> = ({
  disabled = false,
  children,
  ...rest
}) => {
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
};

export default FormControl;
