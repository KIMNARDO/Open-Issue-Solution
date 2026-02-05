import { Box } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { useAppDrawingWorkOrderHelper } from 'api/app-drw/useAppDrawing';
import { WorkOrder } from 'api/project/project.types';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import { withSimpleSearchForm } from 'components/form/SimpleForm';
import SimpleGrid from 'components/grid/SimpleGrid';
import { ExColDef } from 'components/grid/grid.types';
import { useEffect, useRef } from 'react';

const GridSearchBar = withSimpleSearchForm(({ formikProps }) => {
  return <></>;
});

interface WorkOrderSearchDialogProps {
  BasicDialog: ReturnType<typeof useBasicDialog>['BasicDialog'];
  handleClose: ReturnType<typeof useBasicDialog>['handleClose'];
  appDrawUid?: number;
  currentProject?: number;
  onConfirm: (row: WorkOrder[]) => void;
}

const WorkOrderSearchDialog = ({ BasicDialog, handleClose, appDrawUid, currentProject, onConfirm }: WorkOrderSearchDialogProps) => {
  const workOrderColumns: ExColDef[] = [];

  const { data, refetch } = useAppDrawingWorkOrderHelper(currentProject ?? 0, appDrawUid);

  const gridRef = useRef<AgGridReact<WorkOrder>>(null);

  const handleConfirm = () => {
    const selectedRow = gridRef.current?.api.getSelectedRows();
    onConfirm(selectedRow || []);
    handleClose();
  };

  useEffect(() => {
    refetch();
  }, [currentProject, appDrawUid]);

  return (
    <>
      <BasicDialog
        options={{
          title: '수주 선택', //'작업의뢰서 선택',
          description: '수주 정보를 선택해주세요' //'작업의뢰서를 선택해주세요'
        }}
        handleConfirm={handleConfirm}
        actionButtons
      >
        <Box sx={{ width: '35vw', height: '40vh' }}>
          <GridSearchBar initialValues={{}} onSubmit={() => {}} btnActions={{}} />
          <SimpleGrid
            ref={gridRef}
            gridProps={{ rowData: data || [], columnDefs: workOrderColumns, rowSelection: { mode: 'multiRow', checkboxes: true } }}
          />
        </Box>
      </BasicDialog>
    </>
  );
};

export default WorkOrderSearchDialog;
