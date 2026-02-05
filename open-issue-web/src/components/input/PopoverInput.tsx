import React, { useState, useRef, ChangeEventHandler, ChangeEvent } from 'react';
import { TextField, Popover, TextFieldProps, TextFieldVariants } from '@mui/material';

interface PopoverInputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: TextFieldVariants;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const PopoverInput = ({ onChange, variant = 'outlined', ...props }: PopoverInputProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverValue, setPopoverValue] = useState<string>(props.value?.toString() || props.defaultValue?.toString() || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverInputRef = useRef<HTMLInputElement>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <TextField {...props} onClick={handlePopoverOpen} inputRef={inputRef} inputProps={{ sx: { overflow: 'hidden' } }} />
      <Popover
        open={open}
        anchorEl={inputRef.current}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        anchorPosition={{
          top: 0,
          left: 0
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 100,
              width: inputRef.current?.clientWidth ?? undefined,
              padding: '8px',
              overflowY: 'auto',
              textWrap: 'wrap',
              display: 'flex',
              flexDirection: 'column'
            }
          }
        }}
      >
        <TextField
          autoFocus
          name={props.name}
          value={popoverValue}
          ref={popoverInputRef}
          onChange={(e) => {
            setPopoverValue(e.target.value);
            onChange?.(e as ChangeEvent<HTMLInputElement>);
          }}
          onBlur={(e) => {
            props.onBlur?.(e);
            if (inputRef.current) inputRef.current.value = e.target.value;
          }}
          variant="standard"
          disabled={props.disabled}
          multiline
          minRows={1}
          maxRows={10}
          InputProps={{
            sx: {
              width: '100%',
              height: '100%'
            }
          }}
        />
      </Popover>
    </>
  );
};

export default PopoverInput;
