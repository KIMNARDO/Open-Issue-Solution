import { Paper, SxProps, Theme } from '@mui/material';

interface BodySectionProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const BodySection = ({ children, sx }: BodySectionProps) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
    >
      {children}
    </Paper>
  );
};

export default BodySection;
