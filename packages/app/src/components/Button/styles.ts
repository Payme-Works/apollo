import styled, { css, keyframes } from 'styled-components';

interface ContainerProps {
  variant: 'solid' | 'outline';
}

export const Container = styled.button<ContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  border: 0;

  svg {
    margin-right: 8px;
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${({ theme }) => css`
    background: ${theme.colors.primary.base};
    border: 1px solid ${theme.colors.primary.base};
    border-radius: ${theme.borderRadius.md};

    color: ${theme.colors.background.base};
    font-size: ${theme.fonts.sizes.md};
    font-weight: ${theme.fonts.weights.medium};

    padding: 0 ${theme.spaces[6]};
    height: ${theme.sizes[10]};

    transition: background, 0.2s;

    &:hover {
      background: transparent;
      color: ${theme.colors.foreground.base};
    }
  `}
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Loading = styled.div`
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  animation: ${rotate} 2s linear infinite;

  svg {
    margin: 0;
    height: 16px;
    width: 16px;
  }
`;
