import styled, { css } from 'styled-components';

import SelectWrapper from './Wrapper';

interface IContainerProps {
  isErrored: boolean;
}

export const Container = styled(SelectWrapper)<IContainerProps>`
  ${({ theme, isErrored }) => css`
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
  `}
`;
