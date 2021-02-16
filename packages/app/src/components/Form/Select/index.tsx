import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { IconType } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { Props as ReactSelectProps } from 'react-select';

import { useField } from '@unform/core';

import SelectWrapper from '@/components/Form/Select/Wrapper';

import { Container, TitleContainer } from './styles';

export interface ISelectValue {
  label: string;
  value: string;
}

interface ISelectProps extends Omit<ReactSelectProps, 'theme'> {
  name: string;
  label?: string;
  hint?: string;
  icon?: IconType;
  disabled?: boolean;
  defaultValue?: ISelectValue;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

const Select: React.FC<ISelectProps> = ({
  name,
  label,
  hint,
  icon,
  disabled = false,
  defaultValue,
  containerProps,
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
    <Container {...containerProps} isErrored={!!error}>
      {(label || hint) && (
        <TitleContainer>
          {label && <label htmlFor={fieldName}>{label}</label>}
          {hint && <small>{hint}</small>}
        </TitleContainer>
      )}

      <SelectWrapper
        ref={selectRef}
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
      </SelectWrapper>
    </Container>
  );
};

export default memo(Select);
