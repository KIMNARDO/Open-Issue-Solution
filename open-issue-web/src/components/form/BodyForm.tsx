import { Box, SxProps, Theme } from '@mui/material';

interface BodyFormProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const BodyForm = ({ children, sx }: BodyFormProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        p: 2,
        gap: 2,
        overflowY: 'auto',
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

export default BodyForm;
