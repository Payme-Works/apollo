import styled, { css } from 'styled-components';

interface IContainerProps {
  isErrored: boolean;
}

export const Container = styled.div<IContainerProps>`
  ${({ theme, isErrored }) => css`
    width: 100%;

    > span {
      ${isErrored &&
      css`
        border-color: ${theme.colors.palette.red.base};
      `}

      > div#react-select > div[class*='control'] > div[class*='IndicatorsContainer'] {
        ${isErrored &&
        css`
          padding-right: ${theme.spaces[8]};
        `}
      }
    }
  `}
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
