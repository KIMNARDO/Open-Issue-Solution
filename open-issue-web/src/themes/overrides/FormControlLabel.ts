// ==============================|| OVERRIDES - FORM CONTROL LABEL ||============================== //

export default function FormControlLabel() {
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          height: 32,
          marginLeft: 0,
          marginRight: '8px',
          '& .MuiFormControlLabel-label': {
            transform: 'translateY(1px)'
            //lineHeight: 2
          }
        }
      }
    }
  };
}
