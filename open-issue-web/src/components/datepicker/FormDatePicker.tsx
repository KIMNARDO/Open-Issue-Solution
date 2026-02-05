import { Box, Typography } from '@mui/material';
import BasicDatePicker from './BasicDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { FormikErrors } from 'formik';

interface FormDatePickerProps<T> {
  name: string;
  label?: string;
  subLabel?: string;
  setValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<T>> | Promise<void | FormikErrors<T>>;
  value?: string | null;
  required?: boolean;
  width?: number | string;
  error?: string;
  disabled?: boolean;
  disableFuture?: boolean;
  clearable?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
}

const dateFormat = 'YYYY-MM-DD'; //'DD/MM/YYYY';

/**
 *
 * @param name form name
 * @param label 좌측상단 라벨
 * @param setValue formik setFieldValue 함수
 * @param value 날짜 값 (string)
 * @param required 필수 표시
 * @param width 컴포넌트 너비
 * @param error formik error 또는 error메세지
 * @description 폼 날짜 컴포넌트
 * @example
 * <FormDatePicker<FormDataTest>
           name="testDate"
           label="date"
           width={200}
           error={testForm.errors.testDate}
           setValue={testForm.setFieldValue}
         />
 */
const FormDatePicker = <T,>({
  name,
  label,
  subLabel,
  required = false,
  width = '100%',
  error,
  value,
  setValue,
  disabled,
  disableFuture,
  clearable = true,
  variant
}: FormDatePickerProps<T>) => {
  const [date, setDate] = useState<Dayjs | null>(value ? dayjs(value, dateFormat) : null);
  const [cleared, setCleared] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDate(value ? dayjs(value, dateFormat) : null);
  }, [value]);

  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [cleared]);

  return (
    <Box display={'flex'} flexDirection={'column'} width={width}>
      {label && (
        <Typography variant="subtitle1">
          {label}
          {required && <span style={{ color: 'red', paddingLeft: 4 }}>*</span>}
        </Typography>
      )}
      <BasicDatePicker
        open={open}
        name={name}
        value={date}
        onChange={(dateValue: Dayjs | null) => {
          setDate(dateValue);
          if (setValue) {
            setValue(name, dateValue ? dayjs(dateValue).format(dateFormat) : null);
          }
        }}
        format={dateFormat}
        slotProps={{
          textField: {
            error: !!error,
            helperText: error,
            onClick: () => !disabled && setOpen(true),
            style: { userSelect: 'none' },
            variant
          },
          field: { clearable: clearable, onClear: () => setCleared(true) },
          openPickerButton: { onClick: () => !disabled && setOpen(true) }
        }}
        onClose={() => setOpen(false)}
        label={subLabel}
        disabled={disabled}
        disableFuture={disableFuture}
      />
    </Box>
  );
};

export default FormDatePicker;
