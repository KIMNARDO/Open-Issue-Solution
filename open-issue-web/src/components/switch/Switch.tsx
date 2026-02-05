import { Stack, styled, Switch, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';

type AllowedSwitchTypes = 'string' | 'number' | 'boolean';

type SwitchValueType<T extends AllowedSwitchTypes> = T extends 'string'
  ? string
  : T extends 'number'
    ? number
    : T extends 'boolean'
      ? boolean
      : never;

const StyledSwitch = styled(Switch)(({ theme }) => ({
  //   example
  //   width: 28,
  //   height: 16,
  //   padding: 0,
  //   display: 'flex',
  '&:active': {
    // '& .MuiSwitch-thumb': {
    //   width: 15
    // },
    // '& .MuiSwitch-switchBase.Mui-checked': {}
  },
  '& .MuiSwitch-switchBase': {
    // padding: 8,
    transition: theme.transitions.create(['transform', 'color'], {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.sharp
    }),
    '&.Mui-checked': {
      transform: 'translateX(22px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        transition: theme.transitions.create(['background-color', 'opacity'], {
          duration: theme.transitions.duration.short,
          easing: theme.transitions.easing.sharp
        }),
        ...(theme.palette.mode === 'dark' && {
          backgroundColor: theme.palette.primary.dark
        })
      },
      '& .MuiSwitch-thumb': {
        transition: theme.transitions.create(['transform'], {
          duration: theme.transitions.duration.short,
          easing: theme.transitions.easing.sharp
        })
      }
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)'
    // width: 12,
    // height: 12,
    // borderRadius: 6,
    // transition: theme.transitions.create(['width'], {
    //   duration: 500
    // })
  },
  '& .MuiSwitch-track': {
    // borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: 'rgba(255,255,255,.35)'
    })
  }
}));

interface CustomSwitchProps<T extends AllowedSwitchTypes> {
  name: string;
  value: SwitchValueType<T>;
  valueFormat: { true: SwitchValueType<T>; false: SwitchValueType<T> };
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  labelDirection?: 'start' | 'end' | 'top' | 'bottom';
}

const CustomSwitch = <T extends AllowedSwitchTypes>({
  name,
  value,
  valueFormat,
  handleChange,
  label,
  labelDirection = 'start'
}: CustomSwitchProps<T>) => {
  const [checked, setChecked] = useState(value === valueFormat.true);

  useEffect(() => {
    if (value === valueFormat.true) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [value]);

  return (
    <>
      <Stack
        sx={{ display: 'flex' }}
        direction={
          labelDirection === 'start'
            ? 'row'
            : labelDirection === 'end'
              ? 'row-reverse'
              : labelDirection === 'top'
                ? 'column'
                : 'column-reverse'
        }
      >
        <Typography variant="h6" sx={{ textIndent: 4 }}>
          {label}
        </Typography>
        <StyledSwitch name={name} checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'custom-switch' }} />
      </Stack>
    </>
  );
};

export default CustomSwitch;
