import { FormHelperText, SelectVariants } from '@mui/material';
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { BasicSelectOptions } from 'components/select/selectbox.types';

interface FormSelectProps {
  value: string;
  name: string;
  label: string;
  onChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  width?: number | string;
  style?: React.CSSProperties;
  required?: boolean;
  selectProps?: BasicSelectOptions;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  variant?: SelectVariants;
}

const FormSelect = ({
  onChange,
  value,
  name,
  label,
  width = '100%',
  style,
  selectProps = { items: [] },
  disabled = false,
  required = false,
  error = false,
  helperText = '',
  variant = 'outlined'
}: FormSelectProps) => {
  return (
    <FormControl fullWidth sx={{ width }} error={error} variant={variant}>
      {/* <InputLabel id={`select-label-${name}`}>{label}</InputLabel> */}
      <Typography variant="h6">
        {label}
        {required && <span style={{ color: 'red', paddingLeft: 4 }}>*</span>}
      </Typography>
      <Select labelId={`select-label-${name}`} id={`select-${name}`} value={value} style={style} onChange={onChange} disabled={disabled}>
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
      {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FormSelect;
