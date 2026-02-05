import { Box } from '@mui/material';
import React from 'react';

const BasicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={(theme) => ({ p: 1, flex: 1, backgroundColor: theme.palette.background.paper, maxHeight: '100%', overflow: 'auto' })}>
      {children}
    </Box>
    // <MainCard sx={{ mb: 1, border: 'none', borderRadius: 0, height: '100%' }}>
    // </MainCard>
  );
};
export default BasicLayout;
