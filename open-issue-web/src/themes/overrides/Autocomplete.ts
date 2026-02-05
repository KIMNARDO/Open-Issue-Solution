// ==============================|| OVERRIDES - AUTOCOMPLETE ||============================== //

export default function Autocomplete() {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            padding: '3px 9px'
          }
        },
        popper: {
          '& .MuiAutocomplete-paper': {
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.08)'
          }
        },
        popupIndicator: {
          width: 'auto',
          height: 'auto'
        },
        clearIndicator: {
          width: 'auto',
          height: 'auto'
        }
      }
    }
  };
}
