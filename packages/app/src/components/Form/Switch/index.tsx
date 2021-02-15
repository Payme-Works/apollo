/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useField } from '@unform/core';

import { Checkbox, Label, SwitchContainer, SwitchStatus } from './styles';

interface ISwitchProps {
  size: 's' | 'md';
  name: string;
}

const Switch: React.FC<ISwitchProps> = ({ size, name }) => {
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
    <SwitchContainer>
      <Checkbox
        onClick={handleClick}
        ref={switchRef}
        name={name}
        type="checkbox"
        id="switch"
      />
      <Label size={size} htmlFor="switch">
        Toggle
      </Label>
      <SwitchStatus htmlFor="switch">
        {checked === true ? 'Ativado' : 'Desativado'}
      </SwitchStatus>
    </SwitchContainer>
  );
};

export default Switch;
