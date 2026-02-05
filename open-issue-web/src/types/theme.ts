// material-ui
import { Color, TypeBorder, TypeInput } from '@mui/material';
import { SimplePaletteColorOptions, PaletteColorOptions, TypeText, TypeBackground } from '@mui/material/styles';

// ==============================|| DEFAULT THEME - TYPES ||============================== //

export type PaletteThemeProps = {
  primary: SimplePaletteColorOptions;
  secondary: SimplePaletteColorOptions;
  error: SimplePaletteColorOptions;
  warning: SimplePaletteColorOptions;
  info: SimplePaletteColorOptions;
  success: SimplePaletteColorOptions;
  grey: PaletteColorOptions;
  text?: TypeText;
  background?: TypeBackground;
  input?: TypeInput;
  border?: TypeBorder;
};

export type CustomShadowProps = {
  button: string;
  text: string;
  z1: string;
  primary: string;
  primaryButton: string;
  secondary: string;
  secondaryButton: string;
  error: string;
  errorButton: string;
  warning: string;
  warningButton: string;
  info: string;
  infoButton: string;
  success: string;
  successButton: string;
  grey: string;
  greyButton: string;
};

declare module '@mui/material/styles' {
  interface TypeBorder extends Partial<Color> {
    primary: string;
    secondary: string;
    accent: string;
    light: string;
    default: string;
  }

  interface TypeBackground {
    primary: string;
    secondary: string;
    tertiary: string;
    hover: string;
    selected: string;
    editing: string;
    light: string;
    toolbar: string;
  }

  interface TypeInput {
    bg: string;
    border: string;
    focusBorder: string;
  }

  interface Palette {
    border: TypeBorder;
    background: TypeBackground;
    input: TypeInput;
  }
}
