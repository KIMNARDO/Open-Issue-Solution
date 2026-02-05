import { Box } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import CommonButton from 'components/buttons/CommonButton';
import DirectCheckboxRenderer from 'components/cellEditor/DirectCheckbox';
import { withSimpleSearchForm } from 'components/form/SimpleForm';
import CommonGrid from 'components/grid/CommonGrid';
import { ExColDef, ExColGroupDef } from 'components/grid/grid.types';
import { useEditGrid } from 'components/grid/useEditGrid';
import { useMemo, useRef } from 'react';

const Toolbar = withSimpleSearchForm(({ btnActions }) => {
  return (
    <>
      <CommonButton title="저장" onClick={btnActions.save} />
    </>
  );
});

const MenuAuth = () => {
  const gridRef = useRef<AgGridReact>(null);

  const { onUpdateCells } = useEditGrid(gridRef);

  const columnDefs = useMemo<(ExColDef | ExColGroupDef)[]>(
    () => [
      { field: 'menuName', headerName: '메뉴명' },
      { field: 'auth', headerName: '권한', cellRenderer: DirectCheckboxRenderer }
    ],
    []
  );

  return (
    <>
      <Box display="flex" flexDirection="column" height="100%">
        <Toolbar btnActions={{}} initialValues={{}} onSubmit={() => {}} title="메뉴권한설정" />
        <Box flex={1}>
          <CommonGrid ref={gridRef} gridProps={{ rowData: [], columnDefs, onCellValueChanged: onUpdateCells }} />
        </Box>
      </Box>
    </>
  );
};

export default MenuAuth;
