import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    position: relative;

    width: ${theme.sizes[20]};
    height: ${theme.sizes[20]};

    background: ${theme.transparencies[10](theme.colors.primary.base)};
    border: 1px solid ${theme.transparencies[9](theme.colors.primary.base)};
    border-radius: ${theme.borderRadius.full};

    overflow: hidden;

    > svg {
      position: absolute;
      bottom: 0;
      right: 50%;
      transform: translateX(50%);

      width: ${theme.sizes[14]};
      height: ${theme.sizes[14]};

      color: ${theme.transparencies[1](theme.colors.primary.base)};
    }
  `}
`;
