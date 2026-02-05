import { Typography } from '@mui/material';
import { ErrorMessage } from 'formik';
import React from 'react';

const ErrorMsg = ({ name }: { name: string }) => {
  return (
    <ErrorMessage
      name={name}
      component={'span'}
      render={(msg) => (
        <Typography color="red" variant="caption" style={{ padding: 1, fontSize: 12 }}>
          {msg}
        </Typography>
      )}
    />
  );
};

export default ErrorMsg;
