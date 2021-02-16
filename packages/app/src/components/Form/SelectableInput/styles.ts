import styled, { css } from 'styled-components';

interface ContainerProps {
  isErrored: boolean;
  isFocused: boolean;
  isFilled: boolean;
}

export const Container = styled.span<ContainerProps>`
  ${({ theme, isErrored, isFocused, isFilled }) => css`
    position: relative;

    display: flex;
    align-items: center;

    > span {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;

      width: 25%;
      min-width: ${theme.sizes[32]};

      ${isErrored &&
      css`
        border-color: ${theme.colors.palette.red.base};
      `}

      ${isFocused &&
      css`
        border-color: ${theme.colors.primary['accent-1']};
      `}

      > svg#icon {
        color: ${theme.colors.foreground['accent-2']};

        ${(isFocused || isFilled) &&
        css`
          color: ${theme.colors.foreground['accent-1']};
        `}
      }

      > div#react-select
        > div[class*='control']
        > div[class*='IndicatorsContainer'] {
        ${isErrored &&
        css`
          padding-right: ${theme.spaces[8]};
        `}
      }
    }

    > input {
      width: 75%;

      border-top-left-radius: 0;
      border-bottom-left-radius: 0;

      border-left: 0;

      ${isErrored &&
      css`
        border-color: ${theme.colors.palette.red.base};
      `}

      ${isFocused &&
      css`
        border-color: ${theme.colors.primary['accent-1']};
      `}
    }

    > svg#icon-alert {
      position: absolute;
      right: ${theme.spaces[3]};

      color: ${theme.colors.palette.red.base};
    }
  `}
`;
