import styled, { css } from 'styled-components';

interface IContainerProps {
  isCollapsed: boolean;
  headerContainerHeight: number;
}

export const Container = styled.div<IContainerProps>`
  ${({ theme, isCollapsed, headerContainerHeight }) => css`
    border: 1px solid ${theme.colors.background['accent-2']};
    border-radius: ${theme.borderRadius.md};

    width: 100%;
    max-height: 100%;

    overflow: hidden;

    transition: all 0.2s;

    ${isCollapsed &&
    css`
      max-height: calc(${headerContainerHeight}px + ${theme.sizes[12]});
    `}
  `}
`;

export const Content = styled.div`
  ${({ theme }) => css`
    width: 100%;

    padding: ${theme.spaces[6]};
  `}
`;

export const HeaderContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;

    margin-bottom: ${theme.spaces[7]};

    div > h1 {
      font-size: ${theme.fonts.sizes.xl};
      font-weight: ${theme.fonts.weights.regular};
    }

    div > p {
      font-size: ${theme.fonts.sizes.sm};
      color: ${theme.colors.foreground['accent-2']};

      margin-top: ${theme.spaces[3]};
      padding-right: ${theme.spaces[1]};
    }

    svg {
      color: ${theme.colors.primary['accent-1']};

      cursor: pointer;

      :hover {
        color: ${theme.colors.background['accent-3']};
      }
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
