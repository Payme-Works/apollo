import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { IconType } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { Props as ReactSelectProps } from 'react-select';

import { useField } from '@unform/core';

import { Container } from './styles';

export interface ISelectValue {
  label: string;
  value: string;
}

interface ISelectProps extends Omit<ReactSelectProps, 'theme'> {
  name: string;
  icon?: IconType;
  disabled?: boolean;
  defaultValue?: ISelectValue;
}

const Select: React.FC<ISelectProps> = ({
  name,
  icon,
  disabled = false,
  defaultValue,
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
    (newValue: ISelectValue) => {
      setSelected(newValue);

      clearError();
    },
    [clearError],
  );

  return (
    <Container
      ref={selectRef}
      isErrored={!!error}
      {...rest}
      icon={icon}
      value={selected}
      disabled={disabled}
      onChange={handleChangeSelected}
    >
      {!!error && (
        <FiAlertCircle
          id="icon-alert"
          strokeWidth={1}
          onClick={handleOpenSelect}
        />
      )}
    </Container>
  );
};

export default memo(Select);
