// material-ui
import { TypographyVariantsOptions } from '@mui/material/styles';

// types
import { FontFamily, FontSizeMode } from 'types/config';
import { Theme } from '@mui/material';
import getMediumTypo from './typography/md';
import getSmallTypo from './typography/sm';
import getLargeTypo from './typography/lg';

// ==============================|| DEFAULT THEME - TYPOGRAPHY ||============================== //

const Typography = (mode: FontSizeMode, fontFamily: FontFamily, theme: Theme): TypographyVariantsOptions => {
  const base = {
    htmlFontSize: 15,
    fontFamily,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600
  };

  const typoColor = theme.palette.info.darker;

  switch (mode) {
    case 'sm':
      return { ...base, ...getSmallTypo(typoColor) };
    case 'lg':
      return { ...base, ...getLargeTypo(typoColor) };
    default:
      return { ...base, ...getMediumTypo(typoColor) };
  }
};

export default Typography;
