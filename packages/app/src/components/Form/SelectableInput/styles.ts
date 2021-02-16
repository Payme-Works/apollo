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

interface SelectableInputContainerProps {
  isErrored: boolean;
  isFocused: boolean;
  isFilled: boolean;
}

export const SelectableInputContainer = styled.span<SelectableInputContainerProps>`
  ${({ theme, isErrored, isFocused, isFilled }) => css`
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
  `}
`;
