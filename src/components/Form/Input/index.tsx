import React, { useState, useCallback, useRef, useEffect, memo } from 'react';

import { IconType } from 'react-icons';
import { FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

import { useField } from '@unform/core';

import Tooltip from '@/components/Tooltip';

import InputHandler, { InputHandlerProps } from './Handler';

import { Container } from './styles';

type InputProps = {
  name: string;
  icon?: IconType;
} & InputHandlerProps;

const Input: React.FC<InputProps> = ({
  name,
  icon: Icon,
  variant,
  type,
  defaultValue: _defaultValue,
  disabled = false,
  onChange,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    fieldName,
    registerField,
    defaultValue: formDefaultValue,
    error,
    clearError,
  } = useField(name);

  const defaultValue = _defaultValue || formDefaultValue || '';

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const [inputType, setInputType] = useState(type);

  const [value, setValue] = useState<string | number>(defaultValue);

  useEffect(() => {
    if (inputRef.current) {
      registerField<string | number>({
        name: fieldName,
        getValue() {
          return value;
        },
        setValue(_ref, newValue) {
          setValue(newValue);
        },
        clearValue(_ref, newValue) {
          setValue(newValue);
        },
      });
    }
  }, [registerField, fieldName, value]);

  const handleFocusInput = useCallback(() => {
    inputRef.current.focus();
  }, []);

  const handleInputChange = useCallback(
    (newValue: string | number) => {
      setValue(newValue);

      if (error) {
        clearError();
      }

      if (onChange) {
        onChange(newValue as never);
      }
    },
    [clearError, error, onChange],
  );

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

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
      hasIcon={!!Icon}
      isErrored={!!error}
      isFilled={isFilled}
      isFocused={isFocused}
      onClick={handleFocusInput}
    >
      {Icon && <Icon id="icon" strokeWidth={1} />}

      <InputHandler
        ref={inputRef}
        defaultValue={_defaultValue}
        disabled={disabled}
        type={variant === 'native' ? inputType : type}
        variant={variant}
        {...(rest as any)}
        onBlur={handleInputBlur}
        onChangeValue={handleInputChange}
        onFocus={handleInputFocus}
      />

      {type === 'password' &&
        (inputType === 'password' ? (
          <FiEyeOff
            id="icon-eye"
            onClick={handleToggleShowPassword}
            strokeWidth={1}
          />
        ) : (
          <FiEye
            id="icon-eye"
            onClick={handleToggleShowPassword}
            strokeWidth={1}
          />
        ))}

      {!!error && (
        <Tooltip id="icon-alert" text={error}>
          <FiAlertCircle strokeWidth={1} />
        </Tooltip>
      )}
    </Container>
  );
};

export default memo(Input);
