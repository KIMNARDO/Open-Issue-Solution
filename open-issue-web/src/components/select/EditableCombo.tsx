import { Autocomplete, TextField, Typography } from '@mui/material';
import { FormControl } from '@mui/material';
import { SelectboxType } from './selectbox.types';

interface EditableComboProps {
  value: SelectboxType | undefined;
  options: SelectboxType[];
  onChange: (value: SelectboxType | null) => void;
  label?: string;
  width?: number;
  required?: boolean;
  fullWidth?: boolean;
}

const EditableCombo = ({ value, onChange, options, label, width = 200, required = false, fullWidth = false }: EditableComboProps) => {
  return (
    <FormControl sx={{ width: fullWidth ? '100%' : width }}>
      <Typography variant="h6" sx={{ textIndent: 4 }}>
        {label}
        {required && <span style={{ color: 'red', paddingLeft: 4 }}>*</span>}
      </Typography>
      <Autocomplete
        fullWidth
        disablePortal
        freeSolo
        autoFocus
        id="basic-comboBox"
        value={value}
        options={options}
        // isOptionEqualToValue={(option, value) => {
        //   return !value ? false : option.value === value.value;
        // }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          return option.label;
        }}
        renderOption={(props, option) => (
          <li {...props} key={`basic-comboBox-option-${option.value}`}>
            {option.label}
          </li>
        )}
        renderInput={(params) => <TextField {...params} />}
        onChange={(_e, value, _reason) => {
          console.log(value);
          if (typeof value === 'string') {
            onChange({
              label: value,
              value: value
            });
          } else {
            onChange(value);
          }
        }}
        noOptionsText={'결과가 없습니다'}
      />
    </FormControl>
  );
};

export default EditableCombo;
