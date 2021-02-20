import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { IconType } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { Props as ReactSelectProps } from 'react-select';

import { useField } from '@unform/core';

import InputHandler, {
  InputHandlerProps,
} from '@/components/Form/Input/Handler';
import { ISelectValue } from '@/components/Form/Select';
import SelectHandler from '@/components/Form/Select/Handler';
import Tooltip from '@/components/Tooltip';

import { Container } from './styles';

export interface ISelectableInputValue {
  selected?: ISelectValue;
  value?: string | number;
}

interface ISelectableInputProps {
  name: string;
  icon?: IconType;
  disabled?: boolean;
  defaultValue?: ISelectableInputValue;
  selectProps?: ReactSelectProps;
  inputProps?: InputHandlerProps;
}

const SelectableInput: React.FC<ISelectableInputProps> = ({
  name,
  icon,
  disabled = false,
  defaultValue,
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
      value: inputDefaultValue ? String(inputDefaultValue) : '',
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
  }, []);

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
    (newValue: string | number) => {
      setValue(state => ({ ...state, value: newValue }));

      clearError();
    },
    [clearError],
  );

  return (
    <Container isErrored={!!error} isFocused={isFocused} isFilled={isFilled}>
      <SelectHandler
        ref={selectRef}
        {...selectProps}
        icon={icon}
        value={value?.selected}
        disabled={disabled}
        onChange={handleChangeSelected}
        onMenuOpen={handleFocus}
        onMenuClose={handleBlur}
      />

      <InputHandler
        ref={inputRef}
        {...inputProps}
        defaultValue={inputDefaultValue as any}
        disabled={disabled}
        onChangeValue={handleChangeInputValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {!!error && (
        <Tooltip id="icon-alert" text={error}>
          <FiAlertCircle strokeWidth={1} />
        </Tooltip>
      )}
    </Container>
  );
};

export default memo(SelectableInput);
