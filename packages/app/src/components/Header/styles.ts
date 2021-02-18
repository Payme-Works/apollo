import styled, { css } from 'styled-components';

export const Container = styled.header`
  width: 100%;
  height: 40px;

  position: sticky;
  top: 0;
  z-index: 100;

  -webkit-user-select: none;
  -webkit-app-region: drag;

  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => css`
    background: ${theme.colors.background.base};
    border-bottom: 1px solid
      ${theme.transparencies[10](theme.colors.primary.base)};

    strong {
      font-size: ${theme.fonts.sizes.md};
      font-weight: ${theme.fonts.weights.light};
      color: ${theme.colors.foreground.base};
    }
  `}
`;

interface WindowActionsProps {
  position: 'left' | 'right';
  shouldShowIconsOnHover?: boolean;
}

export const WindowActions = styled.div<WindowActionsProps>`
  display: flex;
  align-items: center;

  position: absolute;
  top: 0;

  height: 100%;

  ${props =>
    props.position === 'left'
      ? css`
          left: 16px;
        `
      : css`
          right: 16px;
        `};
`;

interface MacActionButtonProps {
  action: 'close' | 'minimize' | 'maximize';
}

const colors = {
  close: '#FF6058',
  minimize: '#FEBD2D',
  maximize: '#27CA41',
};

export const MacActionButton = styled.button<MacActionButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  -webkit-app-region: no-drag;
  background: ${props => colors[props.action]};
  border: 0;

  ${({ theme }) => css`
    width: ${theme.sizes[3.5]};
    height: ${theme.sizes[3.5]};

    border-radius: 50%;

    transition: opacity 0.2s;

    :hover {
      opacity: 0.6;
    }

    & + button {
      margin-left: ${theme.spaces[2]};
    }
  `}
`;

export const DefaultActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  -webkit-app-region: no-drag;
  background: transparent;
  border: 0;

  color: ${props => props.theme.colors.foreground['accent-1']};

  transition: color 0.2s;

  :hover svg {
    color: ${props => props.theme.colors.foreground.base};
  }

  :active {
    opacity: 0.6;
  }

  :focus {
    outline: 0;
  }

  & + button {
    margin-left: 12px;
  }
`;

export const GoBackButton = styled.button`
  ${({ theme }) => css`
    width: ${theme.sizes[10]};
    height: ${theme.sizes[6]};

    margin-left: ${theme.spaces[4]} !important;

    background: ${theme.colors.background['accent-2']};
    border-radius: 5px;
    border: 0;

    cursor: pointer;

    transition: all 0.2s;

    -webkit-app-region: no-drag;

    :hover {
      opacity: 0.8;
    }

    svg {
      color: ${theme.colors.foreground['accent-1']};
    }
  `}
`;
