import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.background['accent-2']};
    border-radius: ${theme.borderRadius.md};
  `}
`;

export const Content = styled.div`
  ${({ theme }) => css`
    width: 100%;

    padding: ${theme.spaces[6]};

    > h1 {
      font-size: ${theme.fonts.sizes.xl};
      font-weight: ${theme.fonts.weights.regular};
    }

    > p {
      font-size: ${theme.fonts.sizes.sm};
      color: ${theme.colors.foreground['accent-2']};

      margin-top: ${theme.spaces[3]};
      margin-bottom: ${theme.spaces[4]};
    }
  `}
`;

export const Footer = styled.footer`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    background: ${theme.colors.background['accent-1']};
    border-top: 1px solid ${theme.colors.background['accent-2']};

    padding: ${theme.spaces[4]} ${theme.spaces[6]};

    > p {
      font-size: ${theme.fonts.sizes.sm};
      color: ${theme.colors.foreground['accent-2']};
    }
  `}
`;
