import { Box } from '@mui/material';
import { CustomCellRendererProps } from 'ag-grid-react';
import { useNavigate } from 'react-router';

const LinkRenderer = ({ value, node, baseUrl }: CustomCellRendererProps & { baseUrl?: string }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        cursor: 'pointer',
        color: 'primary.main',
        textDecoration: 'underline'
      }}
      onClick={() => {
        if (baseUrl) {
          navigate(`${baseUrl}/${node.id}`);
        }
      }}
    >
      {value}
    </Box>
  );
};

export default LinkRenderer;
