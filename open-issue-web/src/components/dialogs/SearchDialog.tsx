import { Box } from '@mui/material';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useRef, useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import BasicDialog from './BasicDialog';
import SimpleGrid from 'components/grid/SimpleGrid';
import SearchDialogToolbar from './SearchDialogToolbar';
import { SearchDialogProps } from './SearchDialog.types';

/**
 * 검색 전용 다이얼로그 컴포넌트
 * @description Toolbar, 읽기 전용 그리드, 선택/닫기 버튼으로 구성된 다이얼로그
 */
function SearchDialog<T = any>({
  title,
  description,
  searchConditions,
  columnDefs,
  onSearch,
  onSelect,
  onClose,
  open,
  gridProps = {}
}: SearchDialogProps<T>) {
  const gridRef = useRef<AgGridReact<T>>(null);
  const [rowData, setRowData] = useState<T[]>([]);
  const [searchParam, setSearchParam] = useState<Record<string, any>>({});

  // 검색 조건 초기값 설정
  const initialValues = useMemo(() => {
    return searchConditions.reduce(
      (acc, field) => {
        acc[field.name] = field.defaultValue ?? '';
        return acc;
      },
      {} as Record<string, any>
    );
  }, [searchConditions]);

  // 검색 핸들러
  const handleSearch = (searchParams: Record<string, any>) => {
    console.log(searchParams);
    setSearchParam(searchParams);
  };

  // 선택 핸들러
  const handleSelect = () => {
    const selectedRows = gridRef.current?.api.getSelectedRows() || [];
    if (selectedRows.length === 0) {
      alert('선택된 행이 없습니다.');
      return;
    }
    onSelect(selectedRows[0]);
    onClose();
  };

  const onRowDoubleClicked = ({ data }: { data: T }) => {
    if (data) {
      onSelect(data);
      onClose();
    }
  };

  // 다이얼로그가 닫힐 때 데이터 초기화
  useEffect(() => {
    if (!open) {
      setRowData([]);
    }
  }, [open]);

  useEffect(() => {
    (async () => {
      const result = await onSearch(searchParam);
      if (!result) {
        setRowData([]);
        return;
      }
      setRowData(result);
    })();
  }, [searchParam]);

  return (
    <BasicDialog
      open={open}
      handleClose={onClose}
      handleConfirm={handleSelect}
      options={{
        title,
        description,
        contentMaxHeight: '70vh'
      }}
      dialogProps={{
        fullWidth: true
      }}
      actionButtons={false}
      overrideButtons={[
        {
          btnLabel: '닫기',
          btnOptions: {
            variant: 'outlined',
            startIcon: <CloseOutlined />
          },
          btnAction: onClose
        },
        {
          btnLabel: '선택',
          btnOptions: {
            variant: 'contained',
            color: 'primary',
            startIcon: <CheckOutlined />
          },
          btnAction: handleSelect
        }
      ]}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          height: '50vh',
          pt: 1
        }}
      >
        {/* Toolbar */}
        <SearchDialogToolbar
          searchConditions={searchConditions}
          initialValues={initialValues}
          onSubmit={handleSearch}
          useTitle={false}
          direction="end"
          btnActions={{}}
        />

        <SimpleGrid
          ref={gridRef}
          gridProps={{
            ...gridProps,
            columnDefs,
            rowData,
            rowSelection: 'single',
            onRowDoubleClicked
          }}
          autoSizeMode="fullWidth"
        />
      </Box>
    </BasicDialog>
  );
}

export default SearchDialog;
