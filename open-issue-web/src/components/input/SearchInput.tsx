import { Box, Breakpoint, Chip, IconButton, InputAdornment, Popover, TextField, TextFieldVariants } from '@mui/material';
import { ButtonOverrideProps } from 'components/dialogs/BasicDialog';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import SimpleGrid from 'components/grid/SimpleGrid';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ColDef, ColGroupDef, FirstDataRenderedEvent, RowClickedEvent, RowSelectionOptions } from 'ag-grid-community';
import { SearchOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { Typography } from '@mui/material';
import { FormHelperText } from '@mui/material';
import { v4 } from 'uuid';
import { ChevronDownIcon } from '@/components/tiptap-icons/chevron-down-icon';

export type SearchInputProps<T> = {
  data: T[];
  value?: T[];
  valueKey?: keyof T;
  displayValue?: string[];
  columns: (ColDef | ColGroupDef)[];
  onSelect: (value: T[]) => void;
  onDelete?: (value: T) => void;
  dialogTitle?: string;
  dialogDescription?: string;
  multiSelect?: boolean;
  style?: React.CSSProperties;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  variant?: TextFieldVariants;
  tableSize?: { width: string | number; height: string | number };
};

const StartAdornment = <T,>({
  value,
  displayValue,
  height,
  onDelete
}: {
  value: T[];
  displayValue?: string[];
  height?: string | number;
  onDelete?: (value: T) => void;
}) => {
  return (
    <InputAdornment
      position="start"
      sx={{
        gap: 1,
        height: '100%',
        minHeight: height,
        py: 0.7,
        alignContent: 'stretch',
        width: 'auto',
        flexWrap: 'wrap',
        overflowY: 'auto'
      }}
    >
      {value.map((el, idx) => {
        return (
          <Chip
            key={`searchInput-chip-${v4()}`}
            label={displayValue?.[idx] ?? ''}
            size="small"
            onDelete={onDelete ? () => onDelete(el) : undefined}
          />
        );
      })}
    </InputAdornment>
  );
};

// const DialogSearchCondition = <T extends FormikValues>({
//   initialValues,
//   onSubmit,
//   btnActions
// }: {
//   initialValues: T;
//   onSubmit: (values: T) => void;
//   btnActions: Record<string, () => void>;
// }) => {
//   const formik = useFormik<T>({
//     initialValues: initialValues,
//     onSubmit: onSubmit
//   });

//   const options = [
//     { label: 'one', value: '1' },
//     { label: 'two', value: '2' },
//     { label: 'three', value: '3' }
//   ];

//   return (
//     <SearchBarFrame title="검색" useTitle={false}>
//       <SelectBox
//         value={formik.values.three}
//         name="three"
//         label="테스트"
//         onChange={(e) => formik.setFieldValue('three', e.target.value)}
//         selectProps={{
//           items: options,
//           hasAllOption: true
//         }}
//         style={{ width: 120 }}
//       />
//       <BasicComboBox
//         width={120}
//         value={options.find((option) => option.value === formik.values.one)}
//         options={options}
//         onChange={(value) => formik.setFieldValue('one', value)}
//       />
//       <TextField name="two" value={formik.values.two} onChange={formik.handleChange} placeholder="test..." />
//       <CommonButton title="초기화" variant="outlined" icon={<ReloadOutlined />} icononly="true" />
//       <CommonButton title="검색" variant="contained" icon={<SearchOutlined />} />
//     </SearchBarFrame>
//   );
// };

const SearchInput = <T,>({
  data,
  columns,
  onSelect,
  onDelete,
  dialogTitle,
  dialogDescription,
  multiSelect = false,
  valueKey,
  style,
  value,
  displayValue,
  label,
  required,
  error,
  helperText,
  disabled = false,
  variant = 'outlined',
  tableSize = { height: '30vh', width: '50vw' },
  ...props
}: SearchInputProps<T>) => {
  const { BasicDialog, handleOpen, handleClose } = useBasicDialog();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const gridRef = useRef<AgGridReact<T>>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handlePopoverOpen = () => {
    setAnchorEl(inputRef.current);
    setOpen(true);
  };
  const handlePopoverClose = () => {
    setOpen(false);
  };

  const overrideButtons: ButtonOverrideProps[] = [
    {
      btnLabel: '선택',
      btnOptions: {
        variant: 'contained'
      },
      btnAction: () => {
        const selectedData = gridRef.current?.api.getSelectedRows();
        onSelect(selectedData ?? []);
        handleClose();
      }
    },
    {
      btnLabel: '취소',
      btnOptions: {
        variant: 'outlined'
      },
      btnAction: () => {
        handleClose();
      }
    }
  ];

  const rowSelection = useMemo<RowSelectionOptions>(() => {
    return {
      mode: multiSelect ? 'multiRow' : 'singleRow'
    };
  }, [multiSelect]);

  const onRowClicked = useCallback(({ node }: RowClickedEvent<T>) => {
    node.isSelected() ? node.setSelected(false) : node.setSelected(true);
  }, []);

  const onFirstDataRendered = useCallback(
    ({ api }: FirstDataRenderedEvent<T>) => {
      if (!value || !valueKey) return;
      const ids = value.map((el) => el[valueKey]).filter((el) => el !== undefined);
      api.forEachNode((node) => {
        if (node.data?.[valueKey] && ids.includes(node.data?.[valueKey])) {
          node.setSelected(true);
        }
      });
    },
    [value, valueKey]
  );

  // const btnActions: Record<string, (...args: any) => void> = {};
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
        error={error}
        disabled={disabled}
        variant={variant}
        style={{ ...style, minWidth: 15, width: '100%' }}
        value={displayValue && displayValue.length > 0 ? (multiSelect ? displayValue.join(', ') : displayValue[0]) : ''}
        InputProps={{
          startAdornment:
            multiSelect && displayValue ? (
              <StartAdornment value={value ?? []} displayValue={displayValue} height={style?.height} onDelete={onDelete} />
            ) : undefined,
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
            height: multiSelect ? style?.height || 'auto' : style?.height,
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
      {error && <FormHelperText sx={{ color: 'error.main' }}>{helperText}</FormHelperText>}
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
          value?.map((el, idx) => (
            <Chip
              key={`popover-chip-${v4()}`}
              label={displayValue?.[idx] ?? ''}
              size="small"
              onDelete={onDelete ? () => onDelete(el) : undefined}
            />
          ))}
      </Popover>
      <BasicDialog
        options={{ title: dialogTitle ?? '검색 결과', description: dialogDescription }}
        dialogProps={{ maxWidth: 'xl' }}
        overrideButtons={overrideButtons}
      >
        <Box sx={{ pt: 2 }}>
          {/* <DialogSearchCondition initialValues={initialValues} onSubmit={onSubmit} btnActions={btnActions} /> */}
          <SimpleGrid
            ref={gridRef}
            gridProps={{
              rowData: data ?? [],
              columnDefs: columns,
              rowSelection: rowSelection,
              onRowClicked: onRowClicked,
              onFirstDataRendered: onFirstDataRendered
            }}
            style={{ ...tableSize }}
          />
        </Box>
      </BasicDialog>
    </>
  );
};

export default SearchInput;
