import styled, { css } from 'styled-components';

import { SelectHandler } from './Handler';

interface IContainerProps {
  isErrored: boolean;
}

export const Container = styled(SelectHandler)<IContainerProps>`
  ${({ theme, isErrored }) => css`
    ${isErrored &&
    css`
      border-color: ${theme.colors.palette.red.base};
      border-width: ${theme.sizes.px};
      border-style: solid;

      & + svg {
        margin-right: ${theme.spaces[10]};
      }
    `}

    > div#react-select
      > div[class*='control']
      > div[class*='IndicatorsContainer'] {
      ${isErrored &&
      css`
        padding-right: ${theme.spaces[8]};
      `}
    }
  `}
`;
