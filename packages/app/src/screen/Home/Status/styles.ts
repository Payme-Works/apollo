import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spaces[8]} 0;
    margin: 0 ${theme.spaces[8]};

    border-bottom: 1px solid
      ${theme.transparencies[10](theme.colors.primary.base)};
  `}
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  transition: margin-top, 0.2s;

  > p {
    font-size: ${props => props.theme.fonts.sizes.lg};
  }

  div + & {
    margin-top: ${props => props.theme.spaces[6]};
  }
`;
