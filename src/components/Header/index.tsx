import React, { useCallback, useMemo } from 'react';

import { remote } from 'electron';
import os from 'os';
import { FiX, FiMinus, FiSquare, FiChevronLeft } from 'react-icons/fi';
import { useHistory, useLocation } from 'react-router-dom';

import { useConfig } from '../../hooks/useConfig';

import {
  Container,
  WindowActions,
  MacActionButton,
  DefaultActionButton,
  GoBackButton,
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

  const { useMacOSWindowActionButtons } = useConfig('window');

  const shouldUseMacOSWindowActions = useMemo(() => {
    return (
      useMacOSWindowActionButtons ||
      os.platform() === 'darwin' ||
      os.platform() === 'linux'
    );
  }, [useMacOSWindowActionButtons]);

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
        <WindowActions position="left">
          <MacActionButton action="close" onClick={handleCloseWindow} />

          <MacActionButton action="minimize" onClick={handleMinimize} />

          <MacActionButton action="maximize" onClick={handleMaximize} />

          {shouldShowGoBackButton && (
            <GoBackButton onClick={() => history.goBack()}>
              <FiChevronLeft />
            </GoBackButton>
          )}
        </WindowActions>
      ) : (
        <WindowActions position="right">
          <DefaultActionButton onClick={handleMinimize}>
            <FiMinus />
          </DefaultActionButton>

          <DefaultActionButton onClick={handleMaximize}>
            <FiSquare />
          </DefaultActionButton>

          <DefaultActionButton onClick={handleCloseWindow}>
            <FiX />
          </DefaultActionButton>
        </WindowActions>
      )}
    </Container>
  );
}
