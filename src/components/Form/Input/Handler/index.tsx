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

export const InputHandler = forwardRef<HTMLInputElement, InputHandlerProps>(
  (
    {
      variant = 'native',
      onChangeValue,
      onFocus,
      onBlur,
      defaultValue,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [currencyValue, setCurrencyValue] = useState(defaultValue);

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
            onChangeEvent={(_event, _masked, value: number) => {
              setCurrencyValue(value);

              if (currencyValue) {
                onChangeValue(value as never);
              }
            }}
            thousandSeparator="."
            value={currencyValue}
          />
        );
      }

      if (variant === 'number-format') {
        return (
          <NumberFormat
            allowedDecimalSeparators={[',', '.']}
            decimalScale={2}
            decimalSeparator=","
            defaultValue={Number(defaultValue)}
            thousandSeparator="."
            {...(rest as NumberFormatProps)}
            getInputRef={(numberFormatInputRef: HTMLInputElement) => {
              (ref as any).current = numberFormatInputRef; // eslint-disable-line no-param-reassign
            }}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            onValueChange={({ floatValue }) =>
              onChangeValue(floatValue as never)
            }
          />
        );
      }

      return (
        <input
          {...rest}
          ref={ref}
          defaultValue={defaultValue}
          onBlur={handleInputBlur}
          onChange={event => onChangeValue(event.target.value as never)}
          onFocus={handleInputFocus}
        />
      );
    }, [
      currencyValue,
      defaultValue,
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
  },
);
