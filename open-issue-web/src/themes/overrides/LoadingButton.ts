// ==============================|| OVERRIDES - LOADING BUTTON ||============================== //

export default function LoadingButton() {
  return {
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          '&.MuiLoadingButton-loading': {
            opacity: 0.6,
            textShadow: 'none'
          }
        }
      }
    }
  };
}
