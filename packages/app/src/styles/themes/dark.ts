import { DefaultTheme } from 'styled-components';

import defaultTheme from './default';

const darkTheme: DefaultTheme = {
  ...defaultTheme,
  colors: {
    background: {
      base: '#000000',
      'accent-1': '#111111',
      'accent-2': '#333333',
      'accent-3': '#444444',
    },
    foreground: {
      base: '#FFFFFF',
      'accent-1': '#D0D0D0',
    },
    primary: {
      base: '#FFFFFF',
      'accent-1': '#888888',
    },
    palette: {
      transparent: 'transparent',

      green: {
        base: '#53FF83',
        'accent-1': '#4FC66D',
        'accent-2': '#558c64',
      },
      red: {
        base: '#ff5a5a',
        'accent-1': '#FF7373',
        'accent-2': '#954D4D',
      },
    },
  },
};

export default darkTheme;
