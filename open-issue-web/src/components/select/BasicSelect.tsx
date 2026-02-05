import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import { useEffect } from 'react';
import { BasicSelectOptions } from 'components/select/selectbox.types';
import { FormikProps } from 'formik';

interface BasicSelectProps<T> {
  width: number | string;
  onChange: (e: SelectChangeEvent) => void;
  value: string;
  name: string;
  label: string;
  formik: FormikProps<T>;
  selectProps?: BasicSelectOptions;
  disabled?: boolean;
}

function BasicSelect<T>({
  onChange,
  value,
  name,
  label,
  width,
  formik,
  selectProps = { items: [] },
  disabled = false
}: BasicSelectProps<T>) {
  useEffect(() => {
    try {
      if (selectProps?.defaultValue) {
        formik.setFieldValue(name, selectProps.defaultValue);
      }

      if (!selectProps?.defaultValue && selectProps?.hasAllOption) {
        formik.setFieldValue(name, 'ALL');
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }, [selectProps?.defaultValue]);

  return (
    <FormControl fullWidth sx={{ width }}>
      <InputLabel id={`select-label-${name}`}>{label}</InputLabel>
      <Select
        labelId={`select-label-${name}`}
        id={`select-${name}`}
        input={<OutlinedInput placeholder="pholder" />}
        {...{ onChange, value, name }}
        disabled={disabled}
      >
        {selectProps?.hasAllOption && (
          <MenuItem key={`${name}-all`} value={'ALL'}>
            {'전체'}
          </MenuItem>
        )}
        {selectProps?.items &&
          selectProps?.items.map((el) => (
            <MenuItem key={`${name}-${el.value}`} value={el.value}>
              {el.label}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

export default BasicSelect;
