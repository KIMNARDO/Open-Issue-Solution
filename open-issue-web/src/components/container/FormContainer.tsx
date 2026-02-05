import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface FormContainerProps {
  label: string;
  children: ReactNode;
  required?: boolean;
}

const FormContainer = ({ children, label, required = false }: FormContainerProps) => {
  return (
    <Box display={'flex'} flexDirection={'column'} width={'auto'}>
      <Typography variant="caption" sx={{ pl: 1, pb: 0.5 }}>
        {label}
        {required && <span style={{ color: 'red', paddingLeft: 1 }}>*</span>}
      </Typography>
      {children}
    </Box>
  );
};

export default FormContainer;
