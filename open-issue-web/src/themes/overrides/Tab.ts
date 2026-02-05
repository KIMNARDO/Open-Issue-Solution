// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - TAB ||============================== //

export default function Tab(theme: Theme) {
  return {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 'unset',
          height: '32px',
          padding: '0 24px',
          minWidth: 128,
          color: theme.palette.grey[600],
          fontSize: 15,
          marginRight: 8,
          '&:hover': {
            backgroundColor: theme.palette.primary.lighter,
            color: theme.palette.primary.main
          },
          '&:focus-visible': {
            borderRadius: 4,
            outline: `2px solid ${theme.palette.secondary.dark}`
          },
          '&.Mui-selected': {
            borderColor: theme.palette.primary.main,
            borderBottom: '2px solid'
          }
        }
      }
    }
  };
}
