import { animated } from 'react-spring';

import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.background['accent-2']};
    border-radius: ${theme.borderRadius.md};

    width: 100%;
  `}
`;

export const Content = styled(animated.div)`
  ${({ theme }) => css`
    width: 100%;

    padding: ${theme.spaces[6]};
  `}
`;

interface IHeaderContainerProps {
  collapsed: boolean;
}

export const HeaderContainer = styled.div<IHeaderContainerProps>`
  ${({ theme, collapsed }) => css`
    display: flex;

    ${!collapsed &&
    css`
      margin-bottom: ${theme.spaces[7]};
    `}

    justify-content: space-between;

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
