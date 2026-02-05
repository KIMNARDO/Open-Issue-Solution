import { Box, TextField, TextFieldProps, Typography } from '@mui/material';
import PopoverInput from './PopoverInput';
import dayjs from 'dayjs';
import { useRef } from 'react';

interface FormInputProps extends TextFieldProps<'outlined'> {
  label: string;
  required?: boolean;
  width?: number | string;
  dateString?: boolean;
}
/**
 *
 * @param label 좌측상단 라벨
 * @param required 필수 표시
 * @param error formik error
 * @param helperText error message
 * @param placeholder
 * @param width input 너비
 * @param name formik key값
 * @param value formik value
 * @param onChange formik handleChange
 * @param variant outlined
 * @returns
 */
const FormInput = ({ label, required = false, width = '100%', dateString = false, ...props }: FormInputProps) => {
  if (dateString && props.value && typeof props.value === 'string') {
    props.value = dayjs(props.value).isValid() ? dayjs(props.value).format('YYYY-MM-DD') : '-';
  }
  const textRef = useRef<HTMLInputElement>(null);

  return (
    <Box display={'flex'} flexDirection={'column'} width={width}>
      <Typography variant="subtitle1">
        {label}
        {required && <span style={{ color: 'red', paddingLeft: 4 }}>*</span>}
      </Typography>
      {props.multiline ? (
        <PopoverInput {...props} />
      ) : (
        <TextField ref={textRef} key={`FormInput-${props.defaultValue}`} {...props} variant={props.variant || 'outlined'} />
      )}
    </Box>
  );
};

export default FormInput;
