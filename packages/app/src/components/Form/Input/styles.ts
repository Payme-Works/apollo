import styled, { css } from 'styled-components';

export const Container = styled.div`
  flex: 1;
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
  isDisabled: boolean;
  isErrored: boolean;
  isFocused: boolean;
  isFilled: boolean;
  hasIcon: boolean;
}

export const InputContainer = styled.span<InputContainerProps>`
  ${({ theme, isDisabled, isErrored, isFocused, isFilled, hasIcon }) => css`
    position: relative;

    display: flex;
    align-items: center;

    height: ${theme.sizes[9]};

    background: ${theme.colors.palette.transparent};
    border: 1px solid ${theme.colors.background['accent-2']};
    border-radius: ${theme.borderRadius.md};

    cursor: text;

    transition: border 0.2s;

    ${isDisabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
    `}

    ${isErrored &&
    css`
      border-color: ${theme.colors.palette.red.base};
    `}

    ${isFocused &&
    css`
      border-color: ${theme.colors.primary['accent-1']};
    `}

    > input {
      flex: 1;
      width: 100%;
      height: 100%;

      padding: 0 ${theme.spaces[3]};

      ${hasIcon &&
      css`
        padding-left: ${theme.spaces[10]};
      `}

      ${isErrored &&
      css`
        padding-right: ${theme.spaces[10]};
      `}

      border: 0;
      background: ${theme.colors.palette.transparent};

      font-size: ${theme.fonts.sizes.md};
      color: ${theme.colors.foreground.base};

      ::placeholder {
        color: ${theme.colors.foreground['accent-2']};
      }

      &:disabled {
        cursor: not-allowed;
      }
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

    > svg#icon-alert {
      position: absolute;
      right: ${theme.spaces[3]};

      color: ${theme.colors.palette.red.base};

      margin-left: ${theme.spaces[2]};
    }
  `}
`;
