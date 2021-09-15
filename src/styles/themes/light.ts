import { DefaultTheme } from 'styled-components';

import defaultTheme from './default';

export const lightTheme: DefaultTheme = {
  ...defaultTheme,
  colors: {
    background: {
      base: '#FFFFFF',
      'accent-1': '#FAFAFA',
      'accent-2': '#EAEAEA',
      'accent-3': '#999999',
    },
    foreground: {
      base: '#000000',
      'accent-1': '#1E1E1E',
      'accent-2': '#444444',
      'accent-3': '#555555',
    },
    primary: {
      base: '#000000',
      'accent-1': '#333333',
    },
    palette: {
      transparent: 'transparent',

      green: {
        base: '#15C245',
        'accent-1': '#23E754',
        'accent-2': '#51EC7D',
      },
      red: {
        base: '#ff5a5a',
        'accent-1': '#FF7373',
        'accent-2': '#FF9393',
      },
      yellow: {
        base: '#FFD15A',
        'accent-1': '#FFD773',
        'accent-2': '#FFE29C',
      },
      orange: {
        base: '#FF8368',
        'accent-1': '#FF8C73',
        'accent-2': '#FFA794',
      },
    },
  },
};
