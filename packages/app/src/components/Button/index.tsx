import React, { ButtonHTMLAttributes, memo } from 'react';
import { FiLoader } from 'react-icons/fi';

import { Container, Loading } from './styles';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'solid' | 'outline';
}

const Button: React.FC<IButtonProps> = ({
  children,
  type = 'button',
  variant = 'solid',
  loading = false,
  ...rest
}) => {
  return (
    <Container disabled={loading} type={type} variant={variant} {...rest}>
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
