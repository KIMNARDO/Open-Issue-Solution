import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface WrapContainerProps {
  width: string;
  columnGap?: number;
  rowGap?: number;
  children: ReactNode;
}

const WrapContainer = ({ columnGap, rowGap, width, children }: WrapContainerProps) => {
  return (
    <Box display={'flex'} flexWrap={'wrap'} width={width} columnGap={columnGap || 0} rowGap={rowGap || 0}>
      {children}
    </Box>
  );
};

export default WrapContainer;
