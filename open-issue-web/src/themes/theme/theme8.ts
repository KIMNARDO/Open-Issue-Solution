// types
import { PaletteThemeProps } from 'types/theme';
import { PalettesProps } from '@ant-design/colors';
import { PaletteColorOptions } from '@mui/material/styles';
import { ThemeMode } from 'types/config';

// ==============================|| PRESET THEME - ORANGE THEME5 ||============================== //

const Theme8 = (colors: PalettesProps, mode: ThemeMode): PaletteThemeProps => {
  const { grey } = colors;
  const greyColors: PaletteColorOptions = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16]
  };
  const contrastText = '#fff';

  let primaryColors = ['#e7e8f1', '#999def', '#FCC8A3', '#2b33dd', '#ff943d', '#121770', '#0b0e45', '#a63a00', '#080a32', '#591900'];
  let errorColors = ['#FDE8E7', '#F25E52', '#F04134', '#EE3B2F', '#E92A21'];
  let warningColors = ['#FFF7E0', '#FFC926', '#FFBF00', '#FFB900', '#FFA900'];
  let infoColors = ['#E0F4F5', '#26B0BA', '#00A2AE', '#009AA7', '#463A32' /*'#008694'*/];
  let successColors = ['#E0F5EA', '#26B56E', '#00A854', '#00A04D', '#008D3A'];
  let backgroundColors = ['#ffffff', '#f8f9fa', '#fafafa', '#f5f5f5', '#e0f2fe', '#fffbeb', '#f9fafb', '#fafafa'];
  let textColors = ['#1e293b', '#64748b', '#94a3b8'];
  let inputColors = ['#ffffff', '#d1d5db', '#121770'];
  let borderColors = ['#e5e7eb', '#d1d5db', '#cbd5e1', '#121770', '#e0e0e0'];

  if (mode === ThemeMode.DARK) {
    primaryColors = ['#32221a', '#4a2b18', '#5e371b', '#7d4319', '#a85317', '#d26415', '#e9883a', '#f4a962', '#f8c48c', '#fbdbb5'];
    errorColors = ['#321d1d', '#7d2e28', '#d13c31', '#e66859', '#f8baaf'];
    warningColors = ['#342c1a', '#836611', '#dda705', '#e9bf28', '#f8e577'];
    infoColors = ['#1a2628', '#11595f', '#058e98', '#1ea6aa', '#64cfcb'];
    successColors = ['#1a2721', '#115c36', '#05934c', '#1da65d', '#61ca8b'];
    backgroundColors = ['#0f172a', '#1e293b', '#1e293b', '#334155', '#1e3a8a', '#422006', '#1e293b', '#0f172a'];
    textColors = ['#f1f5f9', '#cbd5e1', '#64748b'];
    inputColors = ['#0f172a', '#334155', '#60a5fa'];
    borderColors = ['#334155', '#475569', '#475569', '#60a5fa', '#334155'];
  }

  return {
    primary: {
      lighter: primaryColors[0],
      100: primaryColors[1],
      200: primaryColors[2],
      light: primaryColors[3],
      400: primaryColors[4],
      main: primaryColors[5],
      dark: primaryColors[6],
      700: primaryColors[7],
      darker: primaryColors[8],
      900: primaryColors[9],
      contrastText
    },

    secondary: {
      lighter: greyColors[100],
      100: greyColors[100],
      200: greyColors[200],
      light: greyColors[300],
      400: greyColors[400],
      main: greyColors[500]!,
      600: greyColors[600],
      dark: greyColors[700],
      800: greyColors[800],
      darker: greyColors[900],
      A100: greyColors[0],
      A200: greyColors.A400,
      A300: greyColors.A700,
      contrastText: greyColors[0]
    },
    error: {
      lighter: errorColors[0],
      light: errorColors[1],
      main: errorColors[2],
      dark: errorColors[3],
      darker: errorColors[4],
      contrastText
    },
    warning: {
      lighter: warningColors[0],
      light: warningColors[1],
      main: warningColors[2],
      dark: warningColors[3],
      darker: warningColors[4],
      contrastText: greyColors[100]
    },
    info: {
      lighter: infoColors[0],
      light: infoColors[1],
      main: infoColors[2],
      dark: infoColors[3],
      darker: infoColors[4],
      contrastText
    },
    success: {
      lighter: successColors[0],
      light: successColors[1],
      main: successColors[2],
      dark: successColors[3],
      darker: successColors[4],
      contrastText
    },
    grey: greyColors,
    background: {
      default: '#fff',
      paper: '#fff',
      primary: backgroundColors[0],
      secondary: backgroundColors[1],
      tertiary: backgroundColors[2],
      hover: backgroundColors[3],
      selected: backgroundColors[4],
      editing: backgroundColors[5],
      light: backgroundColors[6],
      toolbar: backgroundColors[7]
    },
    text: {
      primary: textColors[0],
      secondary: textColors[1],
      disabled: textColors[2]
    },
    input: {
      bg: inputColors[0],
      border: inputColors[1],
      focusBorder: inputColors[2]
    },
    border: {
      primary: borderColors[0],
      secondary: borderColors[1],
      light: borderColors[2],
      accent: borderColors[3],
      default: borderColors[4]
    }
  };
};

export default Theme8;
