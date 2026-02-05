// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - TABLE ROW ||============================== //

export default function TableBody(theme: Theme) {
  const hoverStyle = {
    '&:hover': {
      //backgroundColor: theme.palette.secondary.lighter
    }
  };

  return {
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& > td:hover': {
            backgroundColor: theme.palette.grey[50]
          },
          '&.striped .MuiTableRow-root': {
            '&:nth-of-type(even)': {
              backgroundColor: theme.palette.grey[50]
            },
            ...hoverStyle
          },
          '& .MuiTableRow-root': {
            ...hoverStyle
          }
        }
      }
    }
  };
}
