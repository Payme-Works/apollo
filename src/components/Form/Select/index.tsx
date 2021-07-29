import React, { useState, useCallback, useRef, useEffect, memo } from 'react';

import { IconType } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';

import { useField } from '@unform/core';

import { ISelectHandlerProps } from './Handler';

import { Container } from './styles';

export interface ISelectValue {
  label: string;
  value: string;
}

interface ISelectProps extends ISelectHandlerProps {
  name: string;
  icon?: IconType;
  disabled?: boolean;
}

const Select: React.FC<ISelectProps> = ({
  name,
  icon,
  disabled = false,
  defaultValue,
  onChange,
  theme: _theme,
  ...rest
}) => {
  const selectRef = useRef<any>(null);

  const {
    fieldName,
    registerField,
    defaultValue: formDefaultValue,
    error,
    clearError,
  } = useField(name);

  const [selected, setSelected] = useState<ISelectValue>(
    defaultValue || formDefaultValue,
  );

  useEffect(() => {
    registerField<ISelectValue>({
      name: fieldName,
      getValue() {
        return selected;
      },
      setValue(_ref, newValue) {
        setSelected(newValue);
      },
      clearValue(_ref, newValue) {
        setSelected(newValue);
      },
    });
  }, [registerField, fieldName, selected]);

  const handleOpenSelect = useCallback(() => {
    if (disabled) {
      return;
    }

    selectRef.current.focus();
    selectRef.current.onMenuOpen();
  }, [disabled]);

  const handleChangeSelected = useCallback(
    (newValue: ISelectValue, action: any) => {
      setSelected(newValue);

      clearError();

      if (onChange) {
        onChange(newValue, action);
      }
    },
    [clearError, onChange],
  );

  return (
    <Container
      ref={selectRef}
      isErrored={!!error}
      {...rest}
      disabled={disabled}
      icon={icon}
      onChange={handleChangeSelected}
      value={selected}
    >
      {!!error && (
        <FiAlertCircle
          id="icon-alert"
          onClick={handleOpenSelect}
          strokeWidth={1}
        />
      )}
    </Container>
  );
};

export default memo(Select);
