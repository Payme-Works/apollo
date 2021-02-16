import React, { forwardRef, useCallback, useState } from 'react';

import { Container } from './styles';

type InputWrapperProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputWrapper: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputWrapperProps
> = ({ onFocus, onBlur, ...rest }, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);

    if (onFocus) {
      onFocus(null);
    }
  }, [onFocus]);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    if (onBlur) {
      onBlur(null);
    }
  }, [onBlur]);

  return (
    <Container
      {...rest}
      ref={ref}
      isFocused={isFocused}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
    />
  );
};

export default forwardRef(InputWrapper);
