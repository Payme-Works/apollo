import React, { useCallback, useMemo, memo } from 'react';
import { FiX, FiMinus, FiSquare } from 'react-icons/fi';

import { remote } from 'electron';
import os from 'os';

import { useConfig } from '../../hooks/useConfig';
import {
  Container,
  WindowActions,
  MacActionButton,
  DefaultActionButton,
} from './styles';

const Header: React.FC = () => {
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

  const useMacOSWindowActionButtons = useConfig('useMacOSWindowActionButtons');

  const shouldUseMacOSWindowActions = useMemo(() => {
    return (
      useMacOSWindowActionButtons ||
      os.platform() === 'darwin' ||
      os.platform() === 'linux'
    );
  }, [useMacOSWindowActionButtons]);

  return (
    <Container>
      <strong>Apollo</strong>

      {shouldUseMacOSWindowActions ? (
        <WindowActions position="left">
          <MacActionButton action="close" onClick={handleCloseWindow} />

          <MacActionButton action="minimize" onClick={handleMinimize} />

          <MacActionButton action="maximize" onClick={handleMaximize} />
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
};

export default memo(Header);
