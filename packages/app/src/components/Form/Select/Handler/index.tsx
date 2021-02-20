import React, { forwardRef, useCallback, useState } from 'react';
import { IconType } from 'react-icons/lib';
import ReactSelect, {
  ActionMeta,
  Props as ReactSelectProps,
} from 'react-select';
import makeAnimated from 'react-select/animated';

import { ISelectValue } from '@/components/Form/Select';

import { Container } from './styles';

export interface ISelectHandlerProps extends ReactSelectProps {
  icon?: IconType;
  disabled?: boolean;
  defaultValue?: ISelectValue;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

const animatedComponents = makeAnimated();

const SelectHandler: React.ForwardRefRenderFunction<
  any,
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
  ref: React.MutableRefObject<any>,
) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const [selected, setSelected] = useState<ISelectValue>(defaultValue);

  const handleOpenSelect = useCallback(() => {
    if (disabled) {
      return;
    }

    ref.current.onMenuOpen();
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
    console.log(ref.current);

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
        id="react-select"
        components={animatedComponents}
        isDisabled={disabled}
        placeholder="Selecione..."
        value={selected}
        {...rest}
        onChange={handleChangeSelected}
        onMenuOpen={handleOnMenuOpen}
        onMenuClose={handleOnMenuClose}
      />

      {children}
    </Container>
  );
};

export default forwardRef(SelectHandler);
