import { SearchOutlined } from '@ant-design/icons';
import { InputAdornment, TextField } from '@mui/material';
import { IconButton } from '@mui/material';
import { Box } from '@mui/material';
import { GridApi } from 'ag-grid-community';
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react';
import { commonNotification } from 'api/common/notification';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import { ExColDef } from 'components/grid/grid.types';
import SimpleGrid from 'components/grid/SimpleGrid';
import { useRef } from 'react';

interface SearchInputRendererProps<T> {
  idKey: keyof T;
  valueKey: keyof T;
  rowData: T[];
  tableColDef: ExColDef[];
  handleSelect: (selected: T[], data: any, api: GridApi) => void;
  onOpen?: () => void;
  multiCheck?: boolean;
}

const SearchInputRenderer = <T,>({
  api,
  data,
  value,
  colDef,
  rowData = [],
  tableColDef = [],
  handleSelect,
  onOpen,
  idKey,
  multiCheck,
  valueKey
}: CustomCellRendererProps & SearchInputRendererProps<T>) => {
  const { BasicDialog, handleOpen, handleClose } = useBasicDialog();

  const gridRef = useRef<AgGridReact>(null);

  const formatValue = (value: T[]) => {
    if (!Array.isArray(value) || !valueKey) return '';
    return value.map((el) => el[valueKey]).join(', ');
  };

  const selectDefault = () => {
    if (!Array.isArray(value)) return;
    value.forEach((el) => {
      gridRef.current?.api.forEachNode((node) => {
        if (node.data[idKey] === el[idKey]) {
          node.setSelected(true);
        }
      });
    });
  };

  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
      <TextField
        // helperText={helperText}
        style={{ minWidth: 15, width: '100%' }}
        variant={'standard'}
        value={formatValue(value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  handleOpen();
                  onOpen?.();
                  selectDefault();
                }}
              >
                <SearchOutlined />
              </IconButton>
            </InputAdornment>
          ),
          readOnly: true,
          style: {
            justifyContent: 'space-between',
            backgroundColor: 'transparent',
            fontSize: '12px'
          }
        }}
        inputProps={{
          style: {
            textAlign: 'center'
          }
        }}
      />
      <BasicDialog
        options={{ title: '검색', confirmText: '선택', cancelText: '닫기' }}
        actionButtons
        handleConfirm={() => {
          if (!gridRef.current?.api || !data) return;
          if (gridRef.current?.api.getSelectedNodes().length < 1) {
            commonNotification.warn('선택된 항목이 없습니다');
            return;
          }
          handleSelect(
            gridRef.current?.api.getSelectedNodes().map((el) => el.data),
            data,
            api
          );
          handleClose();
        }}
      >
        <Box sx={{ width: '20vw', height: '30vh', overflow: 'auto' }}>
          <SimpleGrid
            ref={gridRef}
            gridProps={{
              rowData,
              columnDefs: tableColDef,
              rowSelection: { mode: multiCheck ? 'multiRow' : 'singleRow', checkboxes: true },
              onRowClicked: ({ node }) => {
                node.setSelected(node.isSelected() ? false : true);
              },
              onRowDataUpdated: () => {
                selectDefault();
              }
            }}
          />
        </Box>
      </BasicDialog>
    </Box>
  );
};

export default SearchInputRenderer;
