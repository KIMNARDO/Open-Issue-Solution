// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - INPUT LABEL ||============================== //

export default function InputLabel(theme: Theme) {
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.grey[600]
        },
        outlined: {
          lineHeight: '1rem',
          top: -4,
          '&.MuiInputLabel-sizeSmall': {
            lineHeight: 'inherit'
          },
          '&.MuiInputLabel-formControl': {
            color: theme.palette.grey[500]
          },
          '&.MuiInputLabel-shrink': {
            background: theme.palette.background.paper,
            padding: '0 8px',
            marginLeft: -6,
            top: 2,
            lineHeight: 'inherit',
            color: theme.palette.grey[600]
          }
        }
      }
    }
  };
}
