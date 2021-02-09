import React, { lazy, useState, useEffect, Suspense } from 'react';
import { render } from 'react-dom';
import Modal from 'react-modal';
import { HashRouter as Router } from 'react-router-dom';

import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';

import Header from '@/components/Header';
import { GlobalStyle, Window } from '@/styles/global';
import darkTheme from '@/styles/themes/dark';
import startAresPythonServer from '@/utils/ares/startAresPythonServer';

import '../i18n';

const AppProvider = lazy(() => import('./context'));
const Routes = lazy(() => import('./routes'));

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
