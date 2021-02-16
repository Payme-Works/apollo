import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { IconType } from 'react-icons';
import { FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

import { useField } from '@unform/core';

import InputWrapper from '@/components/Form/Input/Wrapper';

import { Container } from './styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: IconType;
}

const Input: React.FC<InputProps> = ({
  name,
  icon: Icon,
  type,
  disabled = false,
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
    <Container
      isErrored={!!error}
      isFocused={isFocused}
      isFilled={isFilled}
      hasIcon={!!Icon}
      onClick={handleFocusInput}
    >
      {Icon && <Icon id="icon" strokeWidth={1} />}

      <InputWrapper
        ref={inputRef}
        defaultValue={defaultValue}
        disabled={disabled}
        type={inputType}
        {...rest}
        onFocus={handleInputFocus}
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
    </Container>
  );
};

export default memo(Input);
