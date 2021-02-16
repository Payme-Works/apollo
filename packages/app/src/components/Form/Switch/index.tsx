import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useField } from '@unform/core';

import { Checkbox, Circle, Container, Label } from './styles';

interface ISwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  name: string;
  size?: 'sm' | 'md';
  label?: boolean;
}

const Switch: React.FC<ISwitchProps> = ({
  name,
  size = 'md',
  label = false,
  defaultChecked,
  ...rest
}) => {
  const switchRef = useRef<HTMLInputElement>(null);

  const { fieldName, registerField } = useField(name);

  const [checked, setChecked] = useState(defaultChecked || false);

  useEffect(() => {
    if (switchRef.current) {
      registerField({
        name: fieldName,
        path: 'checked',
        ref: switchRef.current,
      });
    }
  }, [registerField, switchRef, fieldName]);

  const handleToggle = useCallback(() => {
    const newValue = !switchRef.current.checked;

    switchRef.current.checked = newValue;

    setChecked(newValue);
  }, []);

  const handleChangeCheckbox = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
    },
    [],
  );

  return (
    <Container onClick={handleToggle}>
      <Checkbox
        ref={switchRef}
        id="switch"
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        {...rest}
        onChange={handleChangeCheckbox}
      />

      <Circle size={size} htmlFor="switch">
        Toggle
      </Circle>

      {label && (
        <Label htmlFor="switch">{checked ? 'Ativado' : 'Desativado'}</Label>
      )}
    </Container>
  );
};

export default Switch;