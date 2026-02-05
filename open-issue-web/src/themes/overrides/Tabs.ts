// ==============================|| OVERRIDES - TABS ||============================== //

export default function Tabs() {
  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          marginBottom: '4px',
          minHeight: 'unset',
          '& .MuiTabs-indicator': {
            height: 0
          }
        },
        vertical: {
          overflow: 'visible'
        }
      }
    }
  };
}
