import React, { useMemo, useState } from 'react';

import '../i18n';

import { render } from 'react-dom';
import { SkeletonTheme } from 'react-loading-skeleton';
import Modal from 'react-modal';
import { HashRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';

import { ISelectValue } from '@/components/Form/Select';
import { Header } from '@/components/Header';
import { AppProvider } from '@/context';
import { useConfig } from '@/hooks/useConfig';
import { Routes } from '@/routes';
import { schema } from '@/store/config';
import { GlobalStyle, Window } from '@/styles/global';
import { darkTheme } from '@/styles/themes/dark';
import { lightTheme } from '@/styles/themes/light';

Modal.setAppElement('#root');

const App = () => {
  const [selectedTheme, setSelectedTheme] = useState<ISelectValue>(
    schema.robot.default.application.theme,
  );

  const [_configRef] = useConfig('robot', value => {
    setSelectedTheme(value.application.theme);
  });

  const theme = useMemo(() => {
    return selectedTheme.value === 'dark' ? darkTheme : lightTheme;
  }, [selectedTheme.value]);

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <SkeletonTheme
          color={theme.colors.background['accent-1']}
          highlightColor={theme.colors.background['accent-4']}
        >
          <Router>
            <Window>
              <Header />

              <AppProvider>
                <Routes />
              </AppProvider>
            </Window>

            <GlobalStyle />
          </Router>
        </SkeletonTheme>
      </ThemeProvider>
    </RecoilRoot>
  );
};

render(<App />, document.getElementById('root'));
