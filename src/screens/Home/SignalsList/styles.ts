import styled, { css } from 'styled-components';

export const Container = styled.div`
  overflow-y: auto;
  display: flex;
  width: 100%;
  flex-wrap: wrap;

  ${({ theme }) => css`
    padding: ${theme.spaces[6]};
  `}
`;
