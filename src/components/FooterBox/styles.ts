import styled, { css, keyframes } from 'styled-components';

const delayOverflow = keyframes`
  from {
    overflow: hidden;
  }

  to {
    overflow: visible;
  }
`;

interface IContainerProps {
  isCollapsed: boolean;
  headerContainerHeight: number;
  contentHeight: number;
  footerHeight: number;
}

export const Container = styled.div<IContainerProps>`
  ${({
    theme,
    isCollapsed,
    headerContainerHeight,
    contentHeight,
    footerHeight,
  }) => css`
    border: 1px solid ${theme.colors.background['accent-2']};
    border-radius: ${theme.borderRadius.md};

    width: 100%;
    max-height: calc(
      ${contentHeight}px + ${footerHeight}px + ${theme.sizes[1]}
    );

    transition: max-height 0.6s ease-in-out;

    will-change: max-height;

    ${!isCollapsed &&
    css`
      animation: 2s ${delayOverflow};
    `}

    ${isCollapsed &&
    css`
      overflow: hidden;

      max-height: calc(${headerContainerHeight}px + ${theme.sizes[12]});

      > ${Content} > ${HeaderContainer} > svg {
        transform: rotate(180deg);
      }
    `}

    > ${Content} > ${HeaderContainer} > svg {
      transition: transform 0.2s;
    }
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

    margin-bottom: ${theme.spaces[6]};

    > div {
      margin-right: ${theme.spaces[1]};

      > h1 {
        font-size: ${theme.fonts.sizes.xl};
        font-weight: ${theme.fonts.weights.regular};
      }

      > p {
        color: ${theme.colors.foreground['accent-2']};

        font-size: ${theme.fonts.sizes.sm};
        line-height: ${theme.fonts.lineHeights.base};

        text-align: justify;

        margin-top: ${theme.spaces[3]};
      }
    }

    > svg {
      min-width: ${theme.sizes[4.5]};
      min-height: ${theme.sizes[4.5]};

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
