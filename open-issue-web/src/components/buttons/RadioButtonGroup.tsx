import { FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';

const RadioButtonGroup = ({
  name,
  options,
  value,
  handleChange
}: {
  name: string;
  options: { label: string; value: string }[];
  value?: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [innerValue, setInnerValue] = useState<string>(value || '');

  useEffect(() => {
    setInnerValue(value || '');
  }, [value]);

  return (
    <FormControl>
      <RadioGroup aria-label={`radio-${name}`} name={name} row value={innerValue} onChange={handleChange}>
        {options.map((option) => (
          <FormControlLabel key={`radioButtonGroup-${option.value}`} value={option.value} control={<Radio />} label={option.label} />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonGroup;
