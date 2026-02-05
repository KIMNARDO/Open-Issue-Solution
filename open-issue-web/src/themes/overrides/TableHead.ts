// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableHead(theme: Theme) {
  return {
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.primary.lighter, //grey[50],
          borderTop: `1px solid rgba(24, 29, 31, 0.15)`, //${theme.palette.divider}`,
          borderBottom: `1px solid rgba(24, 29, 31, 0.15)` //2px solid ${theme.palette.divider}`
        }
      }
    }
  };
}
