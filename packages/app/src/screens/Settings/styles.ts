import styled, { css } from 'styled-components';

export const Container = styled.section`
  ${({ theme }) => css`
    padding: ${theme.spaces[8]};
  `}
`;
