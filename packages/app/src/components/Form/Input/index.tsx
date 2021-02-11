import React, {
  useState,
  useCallback,
  InputHTMLAttributes,
  useRef,
  useEffect,
  memo,
} from 'react';
import { IconType } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';

import { useField } from '@unform/core';

import { Container, TitleContainer, InputContainer } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  hint?: string;
  icon?: IconType;
  containerProps: JSX.IntrinsicElements['div'];
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  hint,
  icon: Icon,
  disabled = false,
  containerProps,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    fieldName,
    registerField,
    defaultValue,
    error,
    clearError,
  } = useField(name);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      registerField({
        name: fieldName,
        path: 'value',
        ref: inputRef.current,
      });
    }
  }, [registerField, fieldName]);

  const handleFocusInput = useCallback(() => {
    inputRef.current.focus();
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);

    clearError();
  }, [clearError]);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputRef.current?.value);
  }, []);

  return (
    <Container {...containerProps}>
      {(label || hint) && (
        <TitleContainer>
          {label && <label htmlFor={fieldName}>{label}</label>}
          {hint && <small>{hint}</small>}
        </TitleContainer>
      )}

      <InputContainer
        isDisabled={disabled}
        isErrored={!!error}
        isFocused={isFocused}
        isFilled={isFilled}
        hasIcon={!!Icon}
        onClick={handleFocusInput}
        onFocus={handleInputFocus}
      >
        {Icon && <Icon id="icon" strokeWidth={1} />}

        <input
          ref={inputRef}
          defaultValue={defaultValue}
          disabled={disabled}
          {...rest}
          onBlur={handleInputBlur}
        />

        {!!error && <FiAlertCircle id="icon-alert" strokeWidth={1} />}
      </InputContainer>
    </Container>
  );
};

export default memo(Input);
