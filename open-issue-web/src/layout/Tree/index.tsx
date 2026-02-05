import { Box } from '@mui/material';

interface TreeLayoutProps {
  tree: React.ReactNode;
  children: React.ReactNode;
}

const TreeLayout = ({ tree, children }: TreeLayoutProps) => {
  return (
    // <MainCard sx={{ mb: 1, flex: '1 0 fit-content' }}>
    // </MainCard>
    <Box sx={(theme) => ({ pb: 1, flex: 1, backgroundColor: theme.palette.background.paper, maxHeight: '100%', overflow: 'auto' })}>
      <Box sx={{ display: 'flex', height: '100%', gap: 1, pt: 1 }}>
        {tree}
        <Box sx={{ height: '100%', px: 1, pt: 1, flex: 3, display: 'flex', flexDirection: 'column' }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default TreeLayout;
