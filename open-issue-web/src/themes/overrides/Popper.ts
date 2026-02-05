// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - POPPER CONTENT TEXT ||============================== //

export default function Popper(theme: Theme) {
  return {
    MuiPopper: {
      styleOverrides: {
        root: {
          minWidth: 'fit-content'
        }
      }
    }
  };
}
