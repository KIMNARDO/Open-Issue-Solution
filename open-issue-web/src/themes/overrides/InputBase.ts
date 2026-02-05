import { useTheme } from '@mui/material/styles';

// ==============================|| OVERRIDES - INPUT BASE ||============================== //

export default function InputBase() {
  const theme = useTheme();
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: '36px',
          '&.MuiInput-underline:before': {
            borderBottom: `1px solid ${theme.palette.grey[200]}`
          },
          '&:hover.MuiInput-underline:not(.Mui-disabled, .Mui-error):before': {
            borderBottom: `2px solid ${theme.palette.grey[200]}`
          }
        },
        sizeSmall: {
          height: '32px',
          fontSize: '0.75rem'
        }
      }
    }
  };
}
