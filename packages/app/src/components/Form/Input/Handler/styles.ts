import styled, { css } from 'styled-components';

interface IContainerProps {
  isFocused: boolean;
}

export const Container = styled.div<IContainerProps>`
  ${({ theme, isFocused }) => css`
    flex: 1;

    > input {
      width: 100%;
      height: ${theme.sizes[9]};

      padding: 0 ${theme.spaces[3]};

      background: ${theme.colors.palette.transparent};
      border: 1px solid ${theme.colors.background['accent-2']};
      border-radius: ${theme.borderRadius.md};

      font-size: ${theme.fonts.sizes.md};
      color: ${theme.colors.foreground.base};

      transition: all 0.2s;

      ${isFocused &&
      css`
        border-color: ${theme.colors.primary['accent-1']};
      `}

      ::placeholder {
        color: ${theme.colors.foreground['accent-2']};
      }

      :disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }

      &[type='number'] {
        -moz-appearance: textfield;

        ::-webkit-inner-spin-button,
        ::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
    }
  `}
`;
