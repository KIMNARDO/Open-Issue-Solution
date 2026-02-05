import { Box, SxProps, Theme } from '@mui/material';
import { STACK_BAR_HEIGHT } from 'layout/Dashboard/Drawer/StackBar/PageStackBar';

interface FormLayoutProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const FormLayout = ({ children, sx }: FormLayoutProps) => {
  return (
    <Box
      sx={{
        backgroundColor: 'grey.100',
        display: 'flex',
        flexDirection: 'column',
        height: `calc(100% - ${STACK_BAR_HEIGHT}px)`,
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

export default FormLayout;
