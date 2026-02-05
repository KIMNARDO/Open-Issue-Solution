// material-ui
import { alpha } from '@mui/material/styles';

// ==============================|| OVERRIDES - DIALOG ||============================== //

export default function Dialog() {
  return {
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiDialog-paper': { maxWidth: 'unset' },
          '& .MuiBackdrop-root': {
            backgroundColor: alpha('#000', 0.7)
          }
        }
      }
    }
  };
}
