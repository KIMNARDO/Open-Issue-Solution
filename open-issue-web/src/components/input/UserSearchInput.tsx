import { Chip, IconButton, InputAdornment, Popover, TextField, TextFieldVariants } from '@mui/material';
import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Typography } from '@mui/material';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import { UserValidationType } from 'api/system/user/user.types';
import { ChevronDownIcon } from '@/components/tiptap-icons/chevron-down-icon';
import { v4 } from 'uuid';
import UserSelectDialog from 'dialogs/UserSelectDialog';
import { TreeNode } from 'components/treeView/SimpleTree';

export type UserSearchInputProps = {
  value?: UserValidationType[];
  onSelect: (value: UserValidationType[]) => void;
  onDelete?: (value: UserValidationType) => void;
  dialogTitle?: string;
  dialogDescription?: string;
  multiSelect?: boolean;
  style?: React.CSSProperties;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  variant?: TextFieldVariants;
  disabled?: boolean;
};

const StartAdornment = ({
  value,
  height,
  hasScroll = false,
  onDelete
}: {
  value: UserValidationType[];
  height?: string | number;
  hasScroll?: boolean;
  onDelete?: (value: UserValidationType) => void;
}) => {
  return (
    <InputAdornment
      position="start"
      sx={{
        gap: 1,
        height: '100%',
        minHeight: height,
        py: '6px',
        alignContent: 'stretch',
        width: 'auto',
        flexWrap: 'wrap',
        overflowY: hasScroll ? 'auto' : 'hidden'
      }}
    >
      {value.map((el) => {
        return <Chip key={`searchInput-chip-${v4()}`} label={el.name} onDelete={onDelete ? () => onDelete(el) : undefined} size="small" />;
      })}
    </InputAdornment>
  );
};

const UserSearchInput = ({
  onSelect,
  onDelete,
  dialogTitle,
  dialogDescription,
  multiSelect = false,
  style,
  value,
  label,
  required,
  error,
  helperText,
  variant = 'outlined',
  disabled = false,
  ...props
}: UserSearchInputProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { BasicDialog, handleOpen, handleClose } = useBasicDialog();

  const handleUserSelect = (data: TreeNode[]) => {
    onSelect(data.filter((el) => !!el).map((el) => el.data!));
  };

  const handlePopoverOpen = () => {
    setAnchorEl(inputRef.current);
    setOpen(true);
  };
  const handlePopoverClose = () => {
    setOpen(false);
  };

  return (
    <>
      {label && (
        <Typography variant="h6">
          {label}
          {required && <span style={{ color: 'red', paddingLeft: 1 }}>*</span>}
        </Typography>
      )}
      <TextField
        {...props}
        ref={inputRef}
        disabled={disabled}
        error={error}
        // helperText={helperText}
        style={{ ...style, minWidth: 15, width: '100%' }}
        variant={variant}
        value={value && value.length > 0 ? (multiSelect ? value.map((el) => el.name).join(', ') : value[0].name) : ''}
        InputProps={{
          startAdornment:
            multiSelect && value ? (
              <StartAdornment value={value} height={style?.height} onDelete={disabled || !onDelete ? undefined : onDelete} />
            ) : (
              <div></div>
            ),
          endAdornment: (
            <InputAdornment position="end">
              {multiSelect && (
                <IconButton onClick={open ? handlePopoverClose : handlePopoverOpen}>
                  <ChevronDownIcon />
                </IconButton>
              )}
              <IconButton onClick={handleOpen} disabled={disabled}>
                <SearchOutlined />
              </IconButton>
            </InputAdornment>
          ),
          style: {
            paddingRight: 5,
            paddingLeft: multiSelect ? 5 : 0,
            width: '100%',
            justifyContent: 'space-between'
          },
          slotProps: {
            input: {
              sx: {
                display: multiSelect ? 'none' : undefined
              }
            }
          }
        }}
      />
      {helperText && (
        <Typography variant="body2" color="error">
          {helperText}
        </Typography>
      )}
      <Popover
        id="user-search-input-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 100,
              width: inputRef.current?.clientWidth ?? undefined,
              padding: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              overflow: 'visible',
              gap: 1
            }
          }
        }}
      >
        {multiSelect &&
          value?.map((el) => (
            <Chip
              key={`popover-chip-${v4()}`}
              label={el.name}
              size="small"
              onDelete={disabled ? undefined : onDelete ? () => onDelete(el) : undefined}
            />
          ))}
      </Popover>
      <UserSelectDialog BasicDialog={BasicDialog} handleClose={handleClose} onConfirm={handleUserSelect} multiSelect={multiSelect} />
    </>
  );
};

export default UserSearchInput;
