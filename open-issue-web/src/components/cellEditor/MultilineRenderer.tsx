import { Box } from '@mui/material';
import { CustomCellRendererProps } from 'ag-grid-react';

const MultilineRenderer = ({ value }: CustomCellRendererProps) => {
  return (
    <Box
      sx={{
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'pre'
      }}
    >
      {value}
    </Box>
  );
};

export default MultilineRenderer;
