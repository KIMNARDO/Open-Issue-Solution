import { Checkbox, CheckboxProps, FormControlLabel } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';

type AllowedCheckboxTypes = 'string' | 'number' | 'boolean';

type CheckboxValueType<T extends AllowedCheckboxTypes> = T extends 'string'
  ? string
  : T extends 'number'
    ? number
    : T extends 'boolean'
      ? boolean
      : never;

interface CommonCheckboxProps<T extends AllowedCheckboxTypes> extends Partial<CheckboxProps> {
  name: string;
  value: CheckboxValueType<T>;
  valueFormat: { true: CheckboxValueType<T>; false: CheckboxValueType<T> };
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  labelPlacement?: 'top' | 'bottom' | 'start' | 'end';
}

const CommonCheckbox = <T extends AllowedCheckboxTypes>({
  name,
  value,
  valueFormat,
  handleChange,
  label,
  labelPlacement = 'end',
  ...props
}: CommonCheckboxProps<T>) => {
  const [checked, setChecked] = useState(value === valueFormat.true);

  useEffect(() => {
    if (value === valueFormat.true) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [value]);

  return (
    <FormControlLabel
      value={value}
      control={<Checkbox {...props} name={name} checked={checked} onChange={handleChange} />}
      label={label}
      labelPlacement={labelPlacement}
    />
  );
};

export default CommonCheckbox;
