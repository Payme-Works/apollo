import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { IconType } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import ReactSelect, { Props as ReactSelectProps } from 'react-select';
import makeAnimated from 'react-select/animated';

import { useField } from '@unform/core';

import { Container, TitleContainer, SelectContainer } from './styles';

interface ISelected {
  label: string;
  value: string;
}

interface ISelectProps extends ReactSelectProps {
  name: string;
  label?: string;
  hint?: string;
  icon?: IconType;
  disabled?: boolean;
  defaultValue?: ISelected;
}

const animatedComponents = makeAnimated();

const Select: React.FC<ISelectProps> = ({
  label,
  name,
  hint,
  icon: Icon,
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const [selected, setSelected] = useState<ISelected>(
    defaultValue || formDefaultValue,
  );

  useEffect(() => {
    registerField<ISelected>({
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
    selectRef.current.focus();
    selectRef.current.onMenuOpen();
  }, []);

  const handleChangeSelected = useCallback((newValue: ISelected) => {
    setSelected(newValue);
  }, []);

  const handleOnMenuOpen = useCallback(() => {
    setIsMenuOpen(true);
    setIsFocused(true);

    clearError();
  }, [clearError]);

  const handleOnMenuClose = useCallback(() => {
    setIsMenuOpen(false);
    setIsFocused(false);
    setIsFilled(!!selectRef.current?.state.value);
  }, []);

  return (
    <Container>
      {(label || hint) && (
        <TitleContainer>
          {label && <label htmlFor={fieldName}>{label}</label>}
          {hint && <small>{hint}</small>}
        </TitleContainer>
      )}

      <SelectContainer
        isDisabled={disabled}
        isMenuOpen={isMenuOpen}
        isErrored={!!error}
        isFocused={isFocused}
        isFilled={isFilled}
        hasIcon={!!Icon}
      >
        {Icon && (
          <Icon
            id="icon"
            strokeWidth={1}
            onClick={() => !disabled && handleOpenSelect()}
          />
        )}

        <ReactSelect
          ref={selectRef}
          id="react-select"
          components={animatedComponents}
          isDisabled={disabled}
          placeholder="Selecione..."
          {...rest}
          value={selected}
          onChange={handleChangeSelected}
          onMenuOpen={handleOnMenuOpen}
          onMenuClose={handleOnMenuClose}
        />

        {!!error && (
          <FiAlertCircle
            id="icon-alert"
            strokeWidth={1}
            onClick={() => !disabled && handleOpenSelect()}
          />
        )}
      </SelectContainer>
    </Container>
  );
};

export default memo(Select);
