import { Input } from '@mui/material';
import dayjs from 'dayjs';
import { FormikProps } from 'formik';

export const TableInput = <T,>({
  name,
  formikProps,
  multiline = false,
  rows = 1,
  disabled = false,
  datestring = false
}: {
  name: keyof T;
  formikProps: FormikProps<T>;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  datestring?: boolean;
}) => {
  const formatValue = (value: any) => {
    if (datestring) {
      return dayjs(value as string).isValid() ? dayjs((value as string) ?? '').format('YYYY-MM-DD') : '-';
    }
    return value ?? '';
  };

  return (
    <Input
      value={formatValue(formikProps.values[name] || '')}
      name={name.toString()}
      onChange={formikProps.handleChange}
      sx={{
        width: '100%',
        height: multiline ? '100%' : '28x',
        mr: 1,
        '& >.MuiInput-input': { textAlign: 'left', pb: 0.5, px: 0 }
      }}
      multiline={multiline}
      rows={rows}
      disabled={disabled}
    />
  );
};
