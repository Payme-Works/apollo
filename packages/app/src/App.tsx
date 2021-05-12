import React, { lazy, useState, useEffect, Suspense } from 'react';
import { render } from 'react-dom';
import Modal from 'react-modal';
import { HashRouter as Router } from 'react-router-dom';

import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';

import { ISelectValue } from '@/components/Form/Select';
import Header from '@/components/Header';
import { useConfig } from '@/hooks/useConfig';
import { GlobalStyle, Window } from '@/styles/global';
import darkTheme from '@/styles/themes/dark';
import lightTheme from '@/styles/themes/light';
import startAresPythonServer from '@/utils/ares/startAresPythonServer';

import '../i18n';

const AppProvider = lazy(() => import('./context'));
const Routes = lazy(() => import('./routes'));

Modal.setAppElement('#root');

const App = () => {
  const [
    {
      current: { application },
    },
  ] = useConfig('robot', value => {
    setTheme(value.application.theme);
  });

  const [theme, setTheme] = useState<ISelectValue>(application.theme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startAresPythonServer().then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme.value === 'dark' ? darkTheme : lightTheme}>
        <Router>
          <Window>
            <Header />

            {!loading && (
              <Suspense fallback={<div>Loading...</div>}>
                <AppProvider>
                  <Routes />
                </AppProvider>
              </Suspense>
            )}
          </Window>

          <GlobalStyle />
        </Router>
      </ThemeProvider>
    </RecoilRoot>
  );
};

render(<App />, document.getElementById('root'));
