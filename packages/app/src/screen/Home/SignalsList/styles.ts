import styled, { css } from 'styled-components';

export const Container = styled.div`
  overflow-y: auto;

  ${({ theme }) => css`
    padding: ${theme.spaces[8]};
  `}
`;
