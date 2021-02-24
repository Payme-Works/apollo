import React, { forwardRef, useCallback, useState } from 'react';
import { IconType } from 'react-icons/lib';
import ReactSelect, {
  ActionMeta,
  Props as ReactSelectProps,
} from 'react-select';

import { ISelectValue } from '@/components/Form/Select';

import { Container } from './styles';

export interface ISelectHandlerProps
  extends ReactSelectProps<ISelectValue, boolean> {
  icon?: IconType;
  disabled?: boolean;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

const SelectHandler: React.ForwardRefRenderFunction<
  ReactSelect,
  ISelectHandlerProps
> = (
  {
    icon: Icon,
    disabled = false,
    defaultValue,
    containerProps,
    onChange,
    onMenuOpen,
    onMenuClose,
    children,
    ...rest
  },
  ref: React.MutableRefObject<ReactSelect>,
) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const [selected, setSelected] = useState<
    ISelectValue | readonly ISelectValue[]
  >(defaultValue);

  const handleOpenSelect = useCallback(() => {
    if (disabled) {
      return;
    }

    ref.current.onMenuOpen();
    ref.current.focus();
  }, [disabled, ref]);

  const handleChangeSelected = useCallback(
    (newValue: ISelectValue, action: ActionMeta<ISelectValue>) => {
      setSelected(newValue);

      if (onChange) {
        onChange(newValue, action);
      }
    },
    [onChange],
  );

  const handleOnMenuOpen = useCallback(() => {
    setIsMenuOpen(true);
    setIsFocused(true);

    if (onMenuOpen) {
      onMenuOpen();
    }
  }, [onMenuOpen]);

  const handleOnMenuClose = useCallback(() => {
    setIsMenuOpen(false);
    setIsFocused(false);
    setIsFilled(!!ref.current?.state.value);

    if (onMenuClose) {
      onMenuClose();
    }
  }, [onMenuClose, ref]);

  return (
    <Container
      isDisabled={disabled}
      isMenuOpen={isMenuOpen}
      isFocused={isFocused}
      isFilled={isFilled}
      hasIcon={!!Icon}
      {...containerProps}
    >
      {Icon && <Icon id="icon" strokeWidth={1} onClick={handleOpenSelect} />}

      <ReactSelect
        ref={ref}
        isDisabled={disabled}
        placeholder="Selecione..."
        value={selected}
        noOptionsMessage={() => 'Nenhuma opção'}
        {...rest}
        id="react-select"
        onChange={handleChangeSelected}
        onMenuOpen={handleOnMenuOpen}
        onMenuClose={handleOnMenuClose}
      />

      {children}
    </Container>
  );
};

export default forwardRef(SelectHandler);
