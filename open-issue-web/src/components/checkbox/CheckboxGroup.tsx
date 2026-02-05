import { FormControl, FormControlLabel, FormGroup, FormHelperText } from '@mui/material';
import { Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';

interface CheckboxGroupProps {
  options: { label: string; value: string; disabled?: boolean }[];
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  value?: Record<string, boolean>;
  onChange?: (value: Record<string, boolean>) => void;
}

const CheckboxGroup = ({ options, error, errorMessage, required, onChange, value }: CheckboxGroupProps) => {
  const [checkState, setCheckState] = useState<Record<string, boolean>>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckState({
      ...checkState,
      [event.target.name]: event.target.checked
    });
  };

  useEffect(() => {
    onChange?.(checkState);
  }, [checkState]);

  useEffect(() => {
    if (!value) {
      setCheckState({});
      return;
    }
    setCheckState(value);
  }, [value]);

  return (
    <FormControl required={required} error={error} component="fieldset" variant="standard">
      <FormGroup
        row
        key={`${Object.entries(checkState)
          .map((el) => `${el[0]}-${el[1]}`)
          .join(',')}`}
      >
        {options.map((option) => (
          <FormControlLabel
            key={`checkboxGroup-${option.value}`}
            name={option.value}
            value={option.value}
            control={<Checkbox checked={checkState[option.value]} onChange={handleChange} />}
            label={option.label}
            disabled={option.disabled}
          />
        ))}
      </FormGroup>
      {error && <FormHelperText>{errorMessage ?? 'error'}</FormHelperText>}
    </FormControl>
  );
};

export default CheckboxGroup;
