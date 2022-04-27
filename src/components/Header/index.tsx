import React, { useCallback, useMemo } from 'react';

import { remote } from 'electron';
import os from 'os';
import {
  FiX,
  FiMinus,
  FiSquare,
  FiChevronLeft,
  FiArrowLeft,
} from 'react-icons/fi';
import { useHistory, useLocation } from 'react-router-dom';

import { useConfig } from '../../hooks/useConfig';

import {
  Container,
  MacWindowActions,
  MacActionButton,
  WindowsActionButton,
  MacGoBackButton,
  WindowsWindowActions,
  WindowsButtonsContainer,
  WindowsGoBackButton,
} from './styles';

export function Header() {
  const location = useLocation();
  const history = useHistory();

  const handleCloseWindow = useCallback(() => {
    const window = remote.getCurrentWindow();

    window.close();
  }, []);

  const handleMinimize = useCallback(() => {
    const window = remote.getCurrentWindow();

    window.minimize();
  }, []);

  const handleMaximize = useCallback(() => {
    const window = remote.getCurrentWindow();

    const isMacSystem = os.platform() === 'darwin';

    if (isMacSystem) {
      window.setFullScreen(!window.isFullScreen());

      return;
    }

    if (!window.isMaximized()) {
      window.maximize();
    } else {
      window.unmaximize();
    }
  }, []);

  const [windowConfig] = useConfig('window');

  const shouldUseMacOSWindowActions = useMemo(() => {
    return (
      windowConfig.current.useMacOSWindowActionButtons ||
      os.platform() === 'darwin' ||
      os.platform() === 'linux'
    );
  }, [windowConfig]);

  const shouldShowGoBackButton = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);

    const showGoBackButton = searchParams.get('showGoBackButton');

    if (showGoBackButton === 'true') {
      return true;
    }

    return false;
  }, [location]);

  return (
    <Container>
      <strong>Apollo</strong>

      {shouldUseMacOSWindowActions ? (
        <MacWindowActions>
          <MacActionButton action="close" onClick={handleCloseWindow} />

          <MacActionButton action="minimize" onClick={handleMinimize} />

          <MacActionButton action="maximize" onClick={handleMaximize} />

          {shouldShowGoBackButton && (
            <MacGoBackButton onClick={() => history.goBack()}>
              <FiChevronLeft />
            </MacGoBackButton>
          )}
        </MacWindowActions>
      ) : (
        <WindowsWindowActions>
          {shouldShowGoBackButton && (
            <WindowsGoBackButton onClick={() => history.goBack()}>
              <FiArrowLeft />
            </WindowsGoBackButton>
          )}

          <WindowsButtonsContainer>
            <WindowsActionButton action="minimize" onClick={handleMinimize}>
              <FiMinus />
            </WindowsActionButton>

            <WindowsActionButton action="maximize" onClick={handleMaximize}>
              <FiSquare />
            </WindowsActionButton>

            <WindowsActionButton action="close" onClick={handleCloseWindow}>
              <FiX />
            </WindowsActionButton>
          </WindowsButtonsContainer>
        </WindowsWindowActions>
      )}
    </Container>
  );
}
