import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';

import { Container } from './styles';

interface NativeInputHandleProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'native';
  onChangeValue?(value: string): void;
}

interface NumberFormatInputHandleProps extends NumberFormatProps {
  variant?: 'number-format';
  onChangeValue?(value: number): void;
}

export type InputHandlerProps =
  | NativeInputHandleProps
  | NumberFormatInputHandleProps;

const InputHandler: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputHandlerProps
> = ({ variant = 'native', onChangeValue, onFocus, onBlur, ...rest }, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = useCallback(
    (event: any) => {
      setIsFocused(true);

      if (onFocus) {
        onFocus(event);
      }
    },
    [onFocus],
  );

  const handleInputBlur = useCallback(
    (event: any) => {
      setIsFocused(false);

      if (onBlur) {
        onBlur(event);
      }
    },
    [onBlur],
  );

  const renderVariantComponent = useMemo(() => {
    if (variant === 'number-format') {
      return (
        <NumberFormat
          decimalSeparator=","
          thousandSeparator="."
          allowedDecimalSeparators={[',', '.']}
          decimalScale={2}
          {...(rest as NumberFormatProps)}
          getInputRef={(numberFormatInputRef: HTMLInputElement) => {
            (ref as any).current = numberFormatInputRef;
          }}
          onValueChange={({ floatValue }) => onChangeValue(floatValue as never)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      );
    }

    return (
      <input
        {...rest}
        ref={ref}
        onChange={event => onChangeValue(event.target.value as never)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
    );
  }, [handleInputBlur, handleInputFocus, onChangeValue, ref, rest, variant]);

  return (
    <Container id="input-handler" isFocused={isFocused}>
      {renderVariantComponent}
    </Container>
  );
};

export default forwardRef(InputHandler);
