import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import { BasicSelectOptions } from 'components/select/selectbox.types';

interface BasicSelectProps {
  value: string;
  name: string;
  label: string;
  onChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  selectProps?: BasicSelectOptions;
  disabled?: boolean;
  style?: React.CSSProperties;
}

function SelectBox({ onChange, value, name, label, selectProps = { items: [] }, disabled = false, style }: BasicSelectProps) {
  return (
    <FormControl fullWidth style={style}>
      <InputLabel id={`select-label-${name}`}>{label}</InputLabel>
      <Select
        labelId={`select-label-${name}`}
        id={`select-${name}`}
        input={<OutlinedInput placeholder="pholder" />}
        value={value}
        onChange={onChange}
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

export default SelectBox;
