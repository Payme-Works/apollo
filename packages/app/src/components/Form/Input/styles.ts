import styled, { css } from 'styled-components';

interface ContainerProps {
  isErrored: boolean;
  isFocused: boolean;
  isFilled: boolean;
  hasIcon: boolean;
}

export const Container = styled.span<ContainerProps>`
  ${({ theme, isErrored, isFocused, isFilled, hasIcon }) => css`
    position: relative;

    display: flex;
    align-items: center;

    > #input-handler > input {
      ${isErrored &&
      css`
        border-color: ${theme.colors.palette.red.base};
      `}

      ${hasIcon &&
      css`
        padding-left: ${theme.spaces[10]};
      `}

      ${isErrored &&
      css`
        padding-right: ${theme.spaces[10]};
      `}
    }

    > svg {
      width: ${theme.sizes[5]};
      height: ${theme.sizes[5]};

      cursor: text;
    }

    > svg#icon {
      position: absolute;
      left: ${theme.spaces[3]};

      color: ${theme.colors.foreground['accent-2']};

      ${(isFocused || isFilled) &&
      css`
        color: ${theme.colors.foreground.base};
      `}
    }

    > svg#icon-eye {
      position: absolute;
      right: ${theme.spaces[3]};

      color: ${theme.colors.foreground['accent-2']};

      cursor: pointer;

      ${(isFocused || isFilled) &&
      css`
        color: ${theme.colors.foreground.base};
      `}

      ${isErrored &&
      css`
        right: ${theme.spaces[10]};
      `}
    }

    > #icon-alert {
      position: absolute;
      right: ${theme.spaces[3]};

      > svg {
        color: ${theme.colors.palette.red.base};
      }
    }
  `}
`;
