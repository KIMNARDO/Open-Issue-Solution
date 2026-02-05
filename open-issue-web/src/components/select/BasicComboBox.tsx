import { Autocomplete, TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import { SelectboxType } from './selectbox.types';

interface BasicComboBoxProps {
  value: SelectboxType | undefined;
  options: SelectboxType[];
  onChange: (value: SelectboxType | null) => void;
  label?: string;
  width?: number;
}

const BasicComboBox = ({ value, onChange, options, label, width = 200 }: BasicComboBoxProps) => {
  return (
    <FormControl sx={{ width }}>
      <Autocomplete
        fullWidth
        disablePortal
        id="basic-comboBox"
        value={value}
        options={options}
        isOptionEqualToValue={(option, value) => {
          return !value ? false : option.value === value.value;
        }}
        getOptionLabel={(option) => option.label}
        renderOption={(props, option) => (
          <li {...props} key={`basic-comboBox-option-${option.value}`}>
            {option.label}
          </li>
        )}
        renderInput={(params) => <TextField {...params} label={label} />}
        onChange={(_e, value, _reason) => {
          onChange(value);
        }}
        noOptionsText={'결과가 없습니다'}
      />
    </FormControl>
  );
};

export default BasicComboBox;
