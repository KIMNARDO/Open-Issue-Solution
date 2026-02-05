import { AgGridReact } from 'ag-grid-react';
import CommonGrid from 'components/grid/CommonGrid';
import { useEditGrid } from 'components/grid/useEditGrid';
import { useCallback, useMemo, useRef } from 'react';
import { withSimpleSearchForm } from 'components/form/SimpleForm';
import CommonButton from 'components/buttons/CommonButton';
import { Box } from '@mui/material';
import { useModuleColumns, useRoleColumns } from '../hook/useColumns';
import { RowClickedEvent, RowSelectionOptions } from 'ag-grid-community';
import { commonNotification } from 'api/common/notification';

const Toolbar = withSimpleSearchForm(({ btnActions }) => {
  return (
    <>
      <CommonButton title="저장" onClick={btnActions.save} />
    </>
  );
});

const mockModuleData = [
  {
    module: 'A'
  },
  {
    module: 'B'
  },
  {
    module: 'C'
  },
  {
    module: 'D'
  }
];

const mockRoleData = [
  {
    role: 'A'
  },
  {
    role: 'B'
  },
  {
    role: 'C'
  },
  {
    role: 'D'
  }
];

const RoleAuth = () => {
  const moduleGridRef = useRef<AgGridReact>(null);
  const roleGridRef = useRef<AgGridReact>(null);

  const { onUpdateCells, getUpdatedRows } = useEditGrid(roleGridRef);

  const roleColumnDefs = useRoleColumns();
  const moduleColumnDefs = useModuleColumns();

  const saveBtnHandler = () => {
    const currentModule = moduleGridRef.current?.api.getSelectedRows()[0];
    if (!currentModule) {
      commonNotification.warn('모듈을 선택해주세요.');
      return;
    }
    const updatedRows = getUpdatedRows();
    if (updatedRows.length < 1) {
      commonNotification.warn('수정된 데이터가 없습니다.');
      return;
    }

    console.log(currentModule, updatedRows);
  };

  const btnActions = {
    save: saveBtnHandler
  };

  const onModuleRowClicked = useCallback(({ node }: RowClickedEvent) => {
    node.setSelected(!node.isSelected());
  }, []);

  const moduleRowSelection: RowSelectionOptions = useMemo(
    () => ({
      mode: 'singleRow',
      checkboxes: true
    }),
    []
  );

  return (
    <>
      <Box display="flex" flexDirection="column" height="100%">
        <Toolbar btnActions={btnActions} initialValues={{}} onSubmit={() => {}} title="role 권한설정" />
        <Box display="flex" flex={1} sx={{ '& > div': { flex: 1 } }} gap={1}>
          <CommonGrid
            ref={moduleGridRef}
            gridProps={{
              rowData: mockModuleData,
              columnDefs: moduleColumnDefs,
              onRowClicked: onModuleRowClicked,
              rowSelection: moduleRowSelection
            }}
          />
          <CommonGrid
            ref={roleGridRef}
            gridProps={{ rowData: mockRoleData, columnDefs: roleColumnDefs, onCellValueChanged: onUpdateCells }}
          />
        </Box>
      </Box>
    </>
  );
};

export default RoleAuth;
