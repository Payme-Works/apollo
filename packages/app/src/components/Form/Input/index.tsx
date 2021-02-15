import React, {
  useState,
  useCallback,
  InputHTMLAttributes,
  useRef,
  useEffect,
  memo,
} from 'react';
import { IconType } from 'react-icons';
import { FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

import { useField } from '@unform/core';

import { Container, TitleContainer, InputContainer } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  hint?: string;
  icon?: IconType;
  containerProps: React.HTMLAttributes<HTMLDivElement>;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  hint,
  icon: Icon,
  type,
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

  const [inputType, setInputType] = useState(type);

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

  const handleToggleShowPassword = useCallback(() => {
    if (inputType === 'password') {
      setInputType('text');
    } else {
      setInputType('password');
    }
  }, [inputType]);

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
          type={inputType}
          {...rest}
          onBlur={handleInputBlur}
        />

        {type === 'password' &&
          (inputType === 'password' ? (
            <FiEye
              id="icon-eye"
              strokeWidth={1}
              onClick={handleToggleShowPassword}
            />
          ) : (
            <FiEyeOff
              id="icon-eye"
              strokeWidth={1}
              onClick={handleToggleShowPassword}
            />
          ))}

        {!!error && <FiAlertCircle id="icon-alert" strokeWidth={1} />}
      </InputContainer>
    </Container>
  );
};

export default memo(Input);
