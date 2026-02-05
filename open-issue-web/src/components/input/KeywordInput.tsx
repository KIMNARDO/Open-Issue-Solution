import React, { useState, useRef, KeyboardEvent, ChangeEvent, useCallback } from 'react';
import { Box, Chip, TextField, InputAdornment, Typography, IconButton, Popover, keyframes } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';
import { ChevronDownIcon } from '@/components/tiptap-icons/chevron-down-icon';
import { v4 } from 'uuid';
import { commonNotification } from 'api/common/notification';

interface KeywordInputProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value?: string[];
  onChange?: (keywords: string[]) => void;
  placeholder?: string;
  maxKeywords?: number;
}

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const KeywordInput: React.FC<KeywordInputProps> = ({
  value = [],
  onChange,
  placeholder = '키워드를 입력해주세요',
  maxKeywords = 10,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePopoverOpen = () => {
    setAnchorEl(containerRef.current);
    // setOpen(true);
    setViewOpen(true);
  };
  const handlePopoverClose = () => {
    // setOpen(false);
    setViewOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault();
      addKeyword();
    }
    // backspace로 키워드 삭제하기
    // else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
    //   handleDelete(value.length - 1);
    // }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const checkDuplicate = (label: string) => {
    const exist = value.some((el) => el === label);
    if (exist) {
      commonNotification.warn('이미 존재하는 키워드입니다');
      return true;
    }
    return false;
  };

  const addKeyword = useCallback(() => {
    const keyword = inputValue.trim();
    if (checkDuplicate(keyword)) return;
    if (keyword && !value.includes(keyword) && value.length < maxKeywords) {
      const newKeywords = [...value, keyword];
      onChange?.(newKeywords.filter((k) => !!k && k.length > 0));
      setInputValue('');
    } else if (value.length >= maxKeywords) {
      // Show a message in the UI instead of console
      // The max limit is already handled by the UI message below
    }
  }, [inputValue, value, maxKeywords, onChange]);

  const handleDelete = (index: number) => {
    const newKeywords = value.filter((_, i) => i !== index);
    onChange?.(newKeywords);
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addKeyword();
    }
  };

  return (
    <Box ref={containerRef}>
      <Typography variant="h6" sx={{ textIndent: 4 }}>
        {props.label}
      </Typography>
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <TextField
          {...props}
          label={''}
          fullWidth
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onClick={() => {
            if (props.disabled) return;
            setAnchorEl(containerRef.current);
            setOpen(true);
          }}
          placeholder={value.length === 0 ? placeholder : ''}
          inputRef={inputRef}
          InputProps={{
            startAdornment:
              value && value.length > 0 ? (
                <InputAdornment
                  position="start"
                  sx={{
                    gap: 0.5,
                    height: '100%',
                    py: 0.4,
                    alignContent: 'stretch',
                    width: '100%',
                    flexWrap: 'nowrap',
                    overflowX: 'hidden'
                  }}
                >
                  {value.map((keyword, index) =>
                    keyword ? (
                      <Chip
                        key={`keyword-${v4()}`} // Use original index for key
                        label={keyword}
                        onDelete={props.disabled ? undefined : () => handleDelete(index)}
                        size="small"
                        sx={{
                          maxWidth: '100px',
                          '& .MuiChip-label': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block'
                          }
                        }}
                      />
                    ) : null
                  )}
                </InputAdornment>
              ) : (
                <></>
              ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={open ? handlePopoverClose : handlePopoverOpen}>
                  <ChevronDownIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              px: 0.5,
              '& .MuiInputBase-input': {
                flexGrow: 1,
                pl: 1
              },
              '& .MuiOutlinedInput-root': {
                flexWrap: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                pr: 1
              }
            },
            slotProps: {
              input: {
                sx: {
                  display: 'none'
                }
              }
            }
          }}
        />
      </Box>
      {open && value.length >= maxKeywords && (
        <Box sx={{ fontSize: '0.75rem', color: 'error.main', mt: 0.5, animation: `${shake} 0.5s ease-in-out` }}>
          최대 {maxKeywords}개를 초과할 수 없습니다
        </Box>
      )}
      <Popover
        id="keyword-input-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 100,
              width: containerRef.current?.clientWidth ?? undefined,
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
        <TextField
          fullWidth
          autoFocus
          multiline
          minRows={1}
          maxRows={10}
          variant="standard"
          value={inputValue}
          onChange={handleChange}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          InputProps={{
            // startAdornment: (
            //   <Box sx={{ display: 'flex', gap: 0.5, height: '100%', alignContent: 'stretch', flexWrap: 'wrap' }}>
            //     {value.map((keyword, index) =>
            //       keyword ? (
            //         <Chip
            //           key={`popover-keyword-${v4()}`}
            //           label={keyword}
            //           onDelete={() => handleDelete(index)}
            //           size="small"
            //           sx={{
            //             maxWidth: '100px',
            //             '& .MuiChip-label': {
            //               overflow: 'hidden',
            //               textOverflow: 'ellipsis',
            //               whiteSpace: 'nowrap',
            //               display: 'block'
            //             }
            //           }}
            //         />
            //       ) : null
            //     )}
            //   </Box>
            // ),
            sx: {
              width: '100%',
              height: '100%',
              textWrap: 'wrap'
            }
          }}
        />
      </Popover>
      <Popover
        id="keyword-input-view-popover"
        open={viewOpen}
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
              width: containerRef.current?.clientWidth ?? undefined,
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
        {value?.map((el) => (el ? <Chip key={`popover-chip-${v4()}`} label={el} size="small" /> : null))}
      </Popover>
    </Box>
  );
};

export default KeywordInput;
