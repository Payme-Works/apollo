import { DefaultTheme } from 'styled-components';

import defaultTheme from './default';

const lightTheme: DefaultTheme = {
  ...defaultTheme,
  colors: {
    background: {
      base: '#FFFFFF',
    },
    foreground: {
      base: '#000000',
      'accent-1': '#1E1E1E',
    },
    primary: {
      base: '#000000',
      'accent-1': '#333333',
    },
    palette: {
      transparent: 'transparent',

      green: {
        base: '#15C245',
      },
      red: {
        base: '#ff5a5a',
      },
    },
  },
};

export default lightTheme;
