// material-ui
import { Theme } from '@mui/material/styles';

// project import
import getColors from 'utils/getColors';
import getShadow from 'utils/getShadow';

// types
import { ThemeMode } from 'types/config';
import { ColorProps } from 'types/extended';

interface Props {
  variant: ColorProps;
  theme: Theme;
}

// ==============================|| OVERRIDES - INPUT BORDER & SHADOWS ||============================== //

function getColor({ variant, theme }: Props) {
  const colors = getColors(theme, variant);
  const { light } = colors;

  const shadows = getShadow(theme, `${variant}`);

  return {
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: light
    },
    '&.Mui-focused': {
      boxShadow: shadows,
      '& .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${light}`
      }
    },
    '&.Mui-disabled:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.grey[300],
      color: theme.palette.grey[500]
    },
    '&.Mui-disabled': {
      color: theme.palette.grey[500],
      backgroundColor: theme.palette.grey[100]
    }
  };
}

// ==============================|| OVERRIDES - OUTLINED INPUT ||============================== //

export default function OutlinedInput(theme: Theme) {
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          height: '100%',
          lineHeight: '32px',
          padding: '0 0 0 12px', //'10.5px 14px 10.5px 12px'
          '&.Mui-readOnly': {
            color: theme.palette.grey[900]
          }
        },
        notchedOutline: {
          borderColor: theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[200] : theme.palette.grey[300]
        },
        root: {
          ...getColor({ variant: 'primary', theme }),
          '&.Mui-error': {
            ...getColor({ variant: 'error', theme })
          },
          '&.Mui-readOnly.Mui-focused, &.Mui-disabled.Mui-focused': {
            boxShadow: 'none'
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline, &.Mui-readOnly .MuiOutlinedInput-notchedOutline': {
            borderColor: `${theme.palette.grey[300]} !important`
          }
        },
        inputSizeSmall: {
          padding: '0 8px' //'7.5px 8px 7.5px 12px'
        },
        inputMultiline: {
          padding: 0
        },
        colorSecondary: getColor({ variant: 'secondary', theme }),
        colorError: getColor({ variant: 'error', theme }),
        colorWarning: getColor({ variant: 'warning', theme }),
        colorInfo: getColor({ variant: 'info', theme }),
        colorSuccess: getColor({ variant: 'success', theme })
      }
    }
  };
}
