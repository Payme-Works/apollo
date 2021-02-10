import styled, { css, keyframes } from 'styled-components';

interface ContainerProps {
  variant: 'solid' | 'outline';
  size: 'sm' | 'md';
}

export const Container = styled.button<ContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  border: 0;

  &:disabled {
    cursor: not-allowed;
  }

  ${({ theme, variant, size }) => css`
    --background: ${theme.colors.primary.base};
    --background-hover: ${theme.colors.palette.transparent};
    --border-color: ${theme.colors.primary.base};

    --color: ${theme.colors.background.base};
    --color-hover: ${theme.colors.foreground.base};

    --font-size: ${theme.fonts.sizes.md};
    --height: ${theme.sizes[10]};

    ${variant === 'outline' &&
    css`
      --background: ${theme.colors.palette.transparent};
      --background-hover: ${theme.colors.primary.base};
      --border-color: ${theme.colors.primary.base};

      --color: ${theme.colors.foreground.base};
      --color-hover: ${theme.colors.background.base};
    `}

    ${size === 'sm' &&
    css`
      --font-size: ${theme.fonts.sizes.sm};
      --height: ${theme.sizes[8]};
    `}

    background: var(--background);
    border: 1px solid var(--border-color);

    border-radius: ${theme.borderRadius.md};

    color: var(--color);
    font-size: var(--font-size);
    font-weight: ${theme.fonts.weights.medium};

    padding: 0 ${theme.spaces[6]};
    height: var(--height);

    transition: all 0.2s;

    &:hover {
      background: var(--background-hover);
      color: var(--color-hover);
    }

    svg {
      margin-right: ${theme.spaces[2]};
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
