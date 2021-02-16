import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 100%;
`;

export const TitleContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: flex-end;

    margin-bottom: ${theme.spaces[2]};

    label {
      display: block;

      color: ${theme.colors.foreground['accent-1']};
      font-size: ${theme.fonts.sizes.sm};
    }

    small {
      color: ${theme.colors.foreground['accent-2']};
      font-size: ${theme.fonts.sizes.xs};
      margin-left: ${theme.spaces[2]};
    }
  `}
`;

interface InputContainerProps {
  isErrored: boolean;
  isFocused: boolean;
  isFilled: boolean;
  hasIcon: boolean;
}

export const InputContainer = styled.span<InputContainerProps>`
  ${({ theme, isErrored, isFocused, isFilled, hasIcon }) => css`
    position: relative;

    display: flex;
    align-items: center;

    > input {
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

      margin-right: ${theme.spaces[2]};

      ${(isFocused || isFilled) &&
      css`
        color: ${theme.colors.foreground.base};
      `}
    }

    > svg#icon-eye {
      position: absolute;
      right: ${theme.spaces[3]};

      color: ${theme.colors.foreground['accent-2']};

      margin-left: ${theme.spaces[2]};

      cursor: pointer;

      ${(isFocused || isFilled) &&
      css`
        color: ${theme.colors.foreground.base};
      `}
    }

    > svg#icon-alert {
      position: absolute;
      right: ${theme.spaces[3]};

      color: ${theme.colors.palette.red.base};

      margin-left: ${theme.spaces[2]};
    }
  `}
`;
