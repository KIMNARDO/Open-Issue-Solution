import { ButtonPropsVariantOverrides, ButtonPropsSizeOverrides } from '@mui/material';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    dashed: true;
    shadow: true;
    light: true;
    standard: true;
  }

  interface ButtonPropsSizeOverrides {
    extraSmall;
  }
}
