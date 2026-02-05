// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableCell(theme: Theme) {
  const commonCell = {
    '&:not(:last-of-type)': {
      // position: 'relative'
      /*'&:after': {
        position: 'absolute',
        content: '""',
        backgroundColor: theme.palette.divider,
        width: 1,
        height: 'calc(100% - 30px)',
        right: 0,
        top: 16
      }*/
    }
  };

  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '13px', //0.875rem',
          padding: '2px 10px', //'3px 12px',
          borderColor: theme.palette.grey[300], //'#C6C2BF',
          borderRight: `1px solid ${theme.palette.grey[300]}`, //'1px solid #C6C2BF',
          '&.cell-right': {
            justifyContent: 'flex-end',
            textAlign: 'right',
            '& > *': {
              justifyContent: 'flex-end',
              margin: '0 0 0 auto'
            },
            '& .MuiOutlinedInput-input': {
              textAlign: 'right'
            }
          },
          '&.cell-center': {
            justifyContent: 'center',
            textAlign: 'center',
            '& > *': {
              justifyContent: 'center',
              margin: '0 auto'
            }
          },
          '&:last-child': {
            borderRight: 'none'
          },
          '&:focus': {
            backgroundColor: theme.palette.secondary.lighter
          },
          '&.MuiTableCell-head': {
            backgroundColor: theme.palette.primary.lighter
          }
        },
        sizeSmall: {
          padding: 8
        },
        head: {
          fontSize: '14px',
          fontWeight: 500,
          textAlign: 'center',
          color: theme.palette.info.darker, //'#463A32',
          height: 36,
          ...commonCell
        },
        footer: {
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          ...commonCell
        }
      }
    }
  };
}
