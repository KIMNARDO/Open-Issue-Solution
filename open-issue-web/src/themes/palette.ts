// material-ui
import { alpha, createTheme } from '@mui/material/styles';

// third-party
import { presetDarkPalettes, presetPalettes, PalettesProps } from '@ant-design/colors';

// project import
import ThemeOption from './theme';

// types
import { PaletteThemeProps } from 'types/theme';
import { PresetColor, ThemeMode } from 'types/config';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

const Palette = (mode: ThemeMode, presetColor: PresetColor) => {
  const colors: PalettesProps = mode === ThemeMode.DARK ? presetDarkPalettes : presetPalettes;

  let greyPrimary = [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#f0f0f0',
    '#d9d9d9',
    '#bfbfbf',
    '#999999', //'#8c8c8c',
    '#595959',
    '#262626',
    '#141414',
    '#000000'
  ];
  let greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
  let greyConstant = ['#F3F2F1', '#77787c']; /*#fafafb, '#e6ebf1'*/

  if (mode === ThemeMode.DARK) {
    greyPrimary = ['#000000', '#141414', '#1e1e1e', '#595959', '#8c8c8c', '#bfbfbf', '#d9d9d9', '#f0f0f0', '#f5f5f5', '#fafafa', '#ffffff'];
    // greyPrimary.reverse();
    greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
    greyConstant = ['#121212', '#d3d8db'];
  }
  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor: PaletteThemeProps = ThemeOption(colors, presetColor, mode);

  return createTheme({
    palette: {
      mode,
      common: {
        black: '#000',
        white: '#fff'
      },
      text: {
        primary: mode === ThemeMode.DARK ? alpha(paletteColor.grey[900]!, 0.87) : '#444', //paletteColor.grey[700],
        secondary: mode === ThemeMode.DARK ? alpha(paletteColor.grey[900]!, 0.45) : paletteColor.grey[500],
        disabled: mode === ThemeMode.DARK ? alpha(paletteColor.grey[900]!, 0.1) : paletteColor.grey[500] //400
      },
      background: {
        paper: mode === ThemeMode.DARK ? paletteColor.grey[100] : paletteColor.grey[0],
        default: paletteColor.grey.A50
      },
      ...paletteColor,
      action: {
        disabled: paletteColor.grey[300]
      },
      divider: mode === ThemeMode.DARK ? alpha(paletteColor.grey[900]!, 0.05) : paletteColor.grey[300],
      error: {
        main: '#E41B23',
        lighter: '#F6C2C2'
      }
    }
  });
};

export default Palette;
