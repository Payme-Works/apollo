import React, { ButtonHTMLAttributes, memo } from 'react';

import { FiLoader } from 'react-icons/fi';

import { Container, Loading } from './styles';

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md';
  loading?: boolean;
  disableHover?: boolean;
}

const Button: React.FC<IButtonProps> = ({
  type = 'button',
  variant = 'solid',
  size = 'md',
  loading = false,
  disableHover = false,
  children,
  ...rest
}) => {
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
};

export default memo(Button);
