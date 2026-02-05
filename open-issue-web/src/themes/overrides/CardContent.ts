// ==============================|| OVERRIDES - CARD CONTENT ||============================== //

export default function CardContent() {
  return {
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 0, //20,
          '&:last-child': {
            paddingBottom: 0 //20
          }
        }
      }
    }
  };
}
