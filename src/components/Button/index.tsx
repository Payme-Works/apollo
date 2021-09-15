import React, { ButtonHTMLAttributes } from 'react';

import { FiLoader } from 'react-icons/fi';

import { Container, Loading } from './styles';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md';
  loading?: boolean;
  disableHover?: boolean;
}

export function Button({
  type = 'button',
  variant = 'solid',
  size = 'md',
  loading = false,
  disableHover = false,
  children,
  ...rest
}: ButtonProps) {
  return (
    <Container
      disabled={loading}
      disableHover={disableHover}
      size={size}
      type={type}
      variant={variant}
      {...rest}
    >
      {loading ? (
        <Loading>
          <FiLoader />
        </Loading>
      ) : (
        children
      )}
    </Container>
  );
}
