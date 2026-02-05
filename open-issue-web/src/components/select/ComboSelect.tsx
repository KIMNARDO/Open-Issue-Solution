import { Autocomplete, FormControl, TextField } from '@mui/material';
import { SelectboxType } from './selectbox.types';
import { FormikProps } from 'formik';
import { useEffect, useState } from 'react';

interface ComboSelectProps<T> {
  width: number | string;
  name: string;
  label: string;
  formik: FormikProps<T>;
  defaultValue?: SelectboxType;
  options: SelectboxType[];
  disabled?: boolean;
  creatable?: boolean;
  onChange?: (value: string) => void;
}

function ComboSelect<T>({ width, defaultValue, name, label, formik, disabled, options = [], creatable, onChange }: ComboSelectProps<T>) {
  const [open, setOpen] = useState<boolean>(false);
  const [, setLoadOptions] = useState<readonly SelectboxType[]>(options);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
    (async () => {
      setLoading(true);
      setLoading(false);

      setLoadOptions([...options]);
    })();
  };

  const handleClose = () => {
    setOpen(false);
    setLoadOptions([]);
  };
  useEffect(() => {
    try {
      if (options) {
        formik.setFieldValue(name, options[0]);
      }

      if (options && !defaultValue) {
        formik.setFieldValue(name, 'ALL');
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }, []);

  return (
    <FormControl fullWidth sx={{ width }}>
      <Autocomplete
        id={`combobox-${name}`}
        // disablePortal -- 콤보박스 그리드에 가려지는 현상이 있어 수정 250307
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        options={[{ label: '전체', value: 'ALL' }, ...options]}
        loading={loading}
        // defaultValue={{ label: '전체', value: 'ALL' }}
        value={[{ label: '전체', value: 'ALL' }, ...options].find((el) => el.value === formik.values[name as keyof T])}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={(_e, value) => {
          if (!value) return;
          formik.setFieldValue(name, value.value);
          onChange && onChange(value.value);
        }}
        onInputChange={(_e, _value, reason) => {
          if (reason === 'clear') {
            formik.setFieldValue(name, 'ALL');
            return;
          }
        }}
        getOptionLabel={(option) => option.label}
        renderOption={(props, option) => (
          <li {...props} key={`comboBox-${name}-option-${option.value}`}>
            {option.label}
          </li>
        )}
        renderInput={(params) => <TextField {...params} label={label} slot="Loading..." />}
        disabled={disabled}
      />
    </FormControl>
  );
}

export default ComboSelect;
