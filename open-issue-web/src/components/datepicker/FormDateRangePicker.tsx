import { Box, Typography } from '@mui/material';
import BasicDatePicker from './BasicDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { FormikErrors } from 'formik';

interface FormDateRangePickerProps<T> {
  startName: string;
  endName: string;
  startLabel?: string;
  endLabel?: string;
  values: T;
  label: string;
  setValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<T>> | Promise<void | FormikErrors<T>>;
  value?: string;
  required?: boolean;
  error?: string;
}

const dateFormat = 'YYYY-MM-DD'; //'DD/MM/YYYY'

/**
 *
 * @param name form name
 * @param label 좌측상단 라벨
 * @param setValue formik setFieldValue 함수
 * @param value 날짜 값 (string)
 * @param required 필수 표시
 * @param error formik error 또는 error메세지
 * @description 폼 날짜 컴포넌트
 * @example
 * <FormDateRangePicker<FormDataTest>
           name="testDate"
           label="date"
           width={200}
           error={testForm.errors.testDate}
           setValue={testForm.setFieldValue}
         />
 */
const FormDateRangePicker = <T,>({
  startName,
  endName,
  startLabel,
  endLabel,
  label,
  required = false,
  error,
  value,
  values,
  setValue
}: FormDateRangePickerProps<T>) => {
  // const [startDate, setStartDate] = useState<Dayjs | null>(value ? dayjs(value, dateFormat) : dayjs().subtract(1, 'month'));
  // const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [cleared, setCleared] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
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
    <Box display={'flex'} flexDirection={'column'}>
      <Typography variant="h6">
        {label}
        {required && <span style={{ color: 'red', paddingLeft: 1 }}>*</span>}
      </Typography>
      <Box display={'flex'} flexDirection={'row'} sx={{ '&>.MuiFormControl-root': { flex: '1 1 165px' } }}>
        <BasicDatePicker
          open={startOpen}
          name={`${startName || 'startDate'}`}
          value={dayjs(values[startName as keyof T] as string, 'YYYY-MM-DD')}
          onChange={(dateValue: Dayjs | null) => {
            if (setValue) {
              setValue(`${startName || 'startDate'}`, dateValue ? dayjs(dateValue).format(dateFormat) : null);
            }
          }}
          format={dateFormat}
          slotProps={{
            textField: { error: !!error, helperText: error, onClick: () => setStartOpen(true), style: { userSelect: 'none' } },
            field: { clearable: true, onClear: () => setCleared(true) },
            openPickerButton: { onClick: () => setStartOpen(true) }
          }}
          onClose={() => setStartOpen(false)}
          label={startLabel}
        />
        <span style={{ margin: ' 0px 4px', lineHeight: 2 }}>~</span>
        <BasicDatePicker
          open={endOpen}
          name={`${endName || 'endDate'}`}
          value={dayjs(values[endName as keyof T] as string, 'YYYY-MM-DD')}
          onChange={(dateValue: Dayjs | null) => {
            if (setValue) {
              setValue(`${endName || 'endDate'}`, dateValue ? dayjs(dateValue).format(dateFormat) : null);
            }
          }}
          format={dateFormat}
          slotProps={{
            textField: { error: !!error, helperText: error, onClick: () => setEndOpen(true), style: { userSelect: 'none' } },
            field: { clearable: true, onClear: () => setCleared(true) },
            openPickerButton: { onClick: () => setEndOpen(true) }
          }}
          onClose={() => setEndOpen(false)}
          label={endLabel}
        />
      </Box>
    </Box>
  );
};

export default FormDateRangePicker;
