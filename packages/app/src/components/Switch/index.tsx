/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef } from 'react';

import { useField } from '@unform/core';

import { Checkbox, Label } from './styles';

interface ISwitchProps {
  size: 's' | 'md';
  name: string;
}

const Switch: React.FC<ISwitchProps> = ({ size, name }) => {
  const switchRef = useRef<HTMLInputElement>(null);

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

  return (
    <>
      <Checkbox ref={switchRef} name={name} type="checkbox" id="switch" />
      <Label size={size} htmlFor="switch">
        Toggle
      </Label>
    </>
  );
};

export default Switch;
