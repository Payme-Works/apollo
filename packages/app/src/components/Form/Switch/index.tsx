import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useField } from '@unform/core';

import { Checkbox, Circle, Container, Label } from './styles';

interface ISwitchProps {
  size?: 'sm' | 'md';
  name: string;
  label?: boolean;
}

const Switch: React.FC<ISwitchProps> = ({
  size = 'md',
  name,
  label = false,
}) => {
  const switchRef = useRef<HTMLInputElement>(null);

  const [checked, setChecked] = useState<boolean>(false);

  const { fieldName, registerField } = useField(name);

  useEffect(() => {
    if (switchRef.current) {
      registerField({
        name: fieldName,
        path: 'checked',
        ref: switchRef.current,
      });
    }
  }, [registerField, switchRef, fieldName]);

  const handleClick = useCallback(() => {
    setChecked(!checked);
  }, [checked]);

  return (
    <Container>
      <Checkbox
        onClick={handleClick}
        ref={switchRef}
        name={name}
        type="checkbox"
        id="switch"
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
