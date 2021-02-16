import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { IconType } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { Props as ReactSelectProps } from 'react-select';

import { useField } from '@unform/core';

import InputWrapper from '@/components/Form/Input/Wrapper';
import { ISelectValue } from '@/components/Form/Select';
import SelectWrapper from '@/components/Form/Select/Wrapper';

import { Container, TitleContainer, SelectableInputContainer } from './styles';

export interface ISelectableInputValue {
  selected?: ISelectValue;
  value?: string;
}

interface ISelectableInputProps {
  name: string;
  label?: string;
  hint?: string;
  icon?: IconType;
  disabled?: boolean;
  defaultValue?: ISelectableInputValue;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  selectProps?: ReactSelectProps;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const SelectableInput: React.FC<ISelectableInputProps> = ({
  name,
  label,
  hint,
  icon,
  disabled = false,
  defaultValue,
  containerProps,
  selectProps: {
    theme: _theme,
    defaultValue: selectDefaultValue,
    ...selectProps
  },
  inputProps: { defaultValue: inputDefaultValue, ...inputProps },
}) => {
  const selectRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    fieldName,
    registerField,
    defaultValue: formDefaultValue,
    error,
    clearError,
  } = useField(name);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const [value, setValue] = useState<ISelectableInputValue>(() => {
    if (defaultValue || formDefaultValue) {
      return defaultValue || formDefaultValue;
    }

    const loadValue: ISelectableInputValue = {
      selected: selectDefaultValue as ISelectValue,
      value: inputDefaultValue && String(inputDefaultValue),
    };

    return loadValue;
  });

  useEffect(() => {
    registerField<ISelectableInputValue>({
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
  }, [registerField, fieldName, value]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);

    clearError();
  }, [clearError]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputRef.current?.value);
  }, []);

  const handleChangeSelected = useCallback(
    (newValue: ISelectValue) => {
      setValue(state => ({ ...state, selected: newValue }));

      clearError();
    },
    [clearError],
  );

  const handleChangeInputValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(state => ({ ...state, value: event.target.value }));

      clearError();
    },
    [clearError],
  );

  return (
    <Container {...containerProps}>
      {(label || hint) && (
        <TitleContainer>
          {label && <label htmlFor={fieldName}>{label}</label>}
          {hint && <small>{hint}</small>}
        </TitleContainer>
      )}

      <SelectableInputContainer
        isErrored={!!error}
        isFocused={isFocused}
        isFilled={isFilled}
      >
        <SelectWrapper
          ref={selectRef}
          {...selectProps}
          isErrored={!!error}
          icon={icon}
          value={value?.selected}
          disabled={disabled}
          onChange={handleChangeSelected}
          onMenuOpen={handleFocus}
          onMenuClose={handleBlur}
        />

        <InputWrapper
          ref={inputRef}
          {...inputProps}
          value={value?.value}
          disabled={disabled}
          onChange={handleChangeInputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {!!error && <FiAlertCircle id="icon-alert" strokeWidth={1} />}
      </SelectableInputContainer>
    </Container>
  );
};

export default memo(SelectableInput);
