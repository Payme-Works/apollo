import 'styled-components';

interface IAccent {
  base: string;
  'accent-1'?: string;
  'accent-2'?: string;
  'accent-3'?: string;
  'accent-4'?: string;
  'accent-5'?: string;
  'accent-6'?: string;
  'accent-7'?: string;
  'accent-8'?: string;
  'accent-9'?: string;
}

type Transparentize = (color: string) => string;

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: IAccent;
      foreground: IAccent;
      primary: IAccent;
      palette: {
        transparent: string;

        green: IAccent;
        red: IAccent;
      };
    };
    fonts: {
      families: {
        body: string;
        heading: string;
        mono: string;
      };
      sizes: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
      };
      weights: {
        light: number;
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
      };
      lineHeights: {
        normal: string;
        none: string;
        shorter: string;
        short: string;
        base: string;
        tall: string;
        taller: string;
      };
      letterSpacings: {
        tighter: string;
        tight: string;
        normal: string;
        wide: string;
        wider: string;
        widest: string;
      };
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    spaces: {
      px: string;
      0: string;
      0.5: string;
      1: string;
      1.5: string;
      2: string;
      2.5: string;
      3: string;
      3.5: string;
      4: string;
      5: string;
      6: string;
      7: string;
      8: string;
      9: string;
      10: string;
      12: string;
      14: string;
      16: string;
      20: string;
      24: string;
      28: string;
      32: string;
      36: string;
      40: string;
      44: string;
      48: string;
      52: string;
      56: string;
      60: string;
      64: string;
      72: string;
      80: string;
      96: string;
    };
    sizes: DefaultTheme['spaces'] & {
      full: string;
      '3xs': string;
      '2xs': string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
    };
    borderRadius: {
      none: string;
      sm: string;
      base: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      full: string;
    };
    transparencies: {
      full: Transparentize;
      0: Transparentize;
      1: Transparentize;
      2: Transparentize;
      3: Transparentize;
      4: Transparentize;
      5: Transparentize;
      6: Transparentize;
      7: Transparentize;
      8: Transparentize;
      9: Transparentize;
      10: Transparentize;
      11: Transparentize;
    };
    zIndices: {
      hide: number;
      auto: string;
      base: number;
    };
  }
}
