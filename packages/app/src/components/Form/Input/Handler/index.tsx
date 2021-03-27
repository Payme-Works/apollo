import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import CurrencyInput from 'react-currency-input';
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

interface CurrencyInputHandleProps extends NumberFormatProps {
  variant?: 'currency';
  onChangeValue?(value: number): void;
}

export type InputHandlerProps =
  | NativeInputHandleProps
  | NumberFormatInputHandleProps
  | CurrencyInputHandleProps;

const InputHandler: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputHandlerProps
> = ({ variant = 'native', onChangeValue, onFocus, onBlur, ...rest }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [currencyValue, setCurrencyValue] = useState(2);

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

  useEffect(() => {
    const refAsAny = ref as any;

    if (variant === 'currency' && refAsAny.current) {
      refAsAny.current.theInput.onfocus = handleInputFocus;
      refAsAny.current.theInput.onblur = handleInputBlur;
    }
  }, [handleInputBlur, handleInputFocus, ref, variant]);

  const renderVariantComponent = useMemo(() => {
    if (variant === 'currency') {
      return (
        <CurrencyInput
          ref={ref}
          decimalSeparator=","
          thousandSeparator="."
          value={currencyValue}
          onChangeEvent={(_event, _makedValue, floatValue) => {
            console.log(ref);
            setCurrencyValue(floatValue);

            if (currencyValue) {
              onChangeValue(floatValue as never);
            }
          }}
        />
      );
    }

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
  }, [
    currencyValue,
    handleInputBlur,
    handleInputFocus,
    onChangeValue,
    ref,
    rest,
    variant,
  ]);

  return (
    <Container id="input-handler" isFocused={isFocused}>
      {renderVariantComponent}
    </Container>
  );
};

export default forwardRef(InputHandler);
