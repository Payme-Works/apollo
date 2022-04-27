import styled, { css, DefaultTheme } from 'styled-components';

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

const WindowActions = css`
  display: flex;
  align-items: center;

  position: absolute;
  top: 0;
`;

export const MacWindowActions = styled.div`
  ${WindowActions}

  left: 16px;

  height: 100%;
`;

export const WindowsWindowActions = styled.div`
  ${WindowActions}

  height: 100%;
  width: 100%;
`;

const macActionButtonColors = {
  close: '#FF6058',
  minimize: '#FEBD2D',
  maximize: '#27CA41',
};

interface MacActionButtonProps {
  action: 'close' | 'minimize' | 'maximize';
}

export const MacActionButton = styled.button<MacActionButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  -webkit-app-region: no-drag;
  background: ${props => macActionButtonColors[props.action]};
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

export const MacGoBackButton = styled.button`
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

export const WindowsButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: 0;
  right: 0;

  height: 100%;
`;

const WindowsActionButtonBase = css`
  display: flex;
  align-items: center;
  justify-content: center;

  -webkit-app-region: no-drag;
  background: transparent;
  border: 0;

  height: 100%;

  transition: all 0.056s;
`;

const windowsButtonColors = (theme: DefaultTheme) => ({
  close: '#FF5A5A',
  minimize: theme.colors.background['accent-2'],
  maximize: theme.colors.background['accent-2'],
});

interface WindowsActionButtonProps {
  action: 'close' | 'minimize' | 'maximize';
}

export const WindowsActionButton = styled.button<WindowsActionButtonProps>`
  ${WindowsActionButtonBase}

  ${({ theme, ...props }) => css`
    color: ${theme.colors.foreground['accent-1']};

    width: ${theme.sizes[10]};

    :hover {
      background: ${windowsButtonColors(theme)[props.action]};
      color: ${theme.colors.foreground.base};
    }
  `}
`;

export const WindowsGoBackButton = styled.button`
  ${WindowsActionButtonBase}

  ${({ theme }) => css`
    background: ${theme.colors.background['accent-1']};
    color: ${theme.colors.foreground['accent-1']};

    width: ${theme.sizes[10]};

    :hover {
      background: ${theme.colors.background['accent-2']};
      color: ${theme.colors.foreground.base};
    }
  `}
`;
