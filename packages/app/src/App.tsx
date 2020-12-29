import React, { lazy, useState, useEffect, Suspense } from 'react';
import { render } from 'react-dom';
import Modal from 'react-modal';

import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';

import Header from '@/components/Header';
import startAresPythonServer from '@/utils/ares/startAresPythonServer';

import { GlobalStyle, Window } from './styles/global';
import darkTheme from './styles/themes/dark';

import '../i18n';

const AppProvider = lazy(() => import('./context'));
const Screen = lazy(() => import('./screen'));

Modal.setAppElement('#root');

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startAresPythonServer().then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <RecoilRoot>
      <ThemeProvider theme={darkTheme}>
        <Window>
          <Header />

          {!loading && (
            <Suspense fallback={<div>Loading...</div>}>
              <AppProvider>
                <Screen />
              </AppProvider>
            </Suspense>
          )}
        </Window>

        <GlobalStyle />
      </ThemeProvider>
    </RecoilRoot>
  );
};

render(<App />, document.getElementById('root'));
