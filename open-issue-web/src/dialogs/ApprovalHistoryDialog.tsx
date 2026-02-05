import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Stack } from '@mui/material';
import { CellStyle, ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useGetApprovalHistory } from 'api/user-task/useTaskService';
import CommonButton from 'components/buttons/CommonButton';
import { GridSelectFormatter } from 'components/cellEditor/SelectEditor';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import SimpleGrid from 'components/grid/SimpleGrid';
import { ExColDef } from 'components/grid/grid.types';
import { useEditGrid } from 'components/grid/useEditGrid';
import { commonDateFormatter } from 'components/grid/valueformatter';
import useLibrary from 'hooks/useLibrary';
import { useMemo, useRef } from 'react';

interface ApprovalHistoryDialogProps {
  uid: number;
  type: any;
  BasicDialog: ReturnType<typeof useBasicDialog>['BasicDialog'];
}

const spanCellStyle: CellStyle = {
  height: '100%',
  display: 'flex ',
  'justify-content': 'center',
  'align-items': 'center '
};

const ApprovalHistoryDialog = ({ BasicDialog, uid, type }: ApprovalHistoryDialogProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const { exportToExcel } = useEditGrid(gridRef);

  const { librarySelect } = useLibrary();

  const { data } = useGetApprovalHistory(uid, type);

  const columns = useMemo<(ColDef | ExColDef)[]>(
    () => [
      {
        field: 'approvalUid',
        headerName: 'No',
        maxWidth: 60,
        spanRows: true,
        autoHeight: true,
        wrapText: true,
        cellStyle: spanCellStyle
      },
      {
        field: 'userName',
        headerName: '결재자'
      },
      {
        field: 'approvalType',
        headerName: '역할',
        valueFormatter: GridSelectFormatter,
        context: {
          selectOption: librarySelect.APPROVAL_ROLE
        }
      },
      {
        field: 'approvalDt',
        headerName: '결재일',
        valueFormatter: commonDateFormatter
      },
      {
        field: 'regDt',
        headerName: '등록일',
        valueFormatter: commonDateFormatter
      },
      {
        field: 'status',
        headerName: '상태'
      }
    ],
    []
  );

  return (
    <BasicDialog options={{ title: '결재 이력' }}>
      <Box sx={{ width: '80vw', height: 600 }}>
        <Stack flexDirection="row" gap={1} justifyContent="flex-end" py={1}>
          <CommonButton
            title="다운로드"
            variant="outlined"
            color="primary"
            icon={<FontAwesomeIcon icon={faDownload} />}
            size="small"
            onClick={() => {
              exportToExcel({ title: '결재이력' });
            }}
          />
        </Stack>
        <Box height="calc(100% - 40px)">
          <SimpleGrid ref={gridRef} gridProps={{ rowData: data || [], columnDefs: columns, enableCellSpan: true }} />
        </Box>
      </Box>
    </BasicDialog>
  );
};

export default ApprovalHistoryDialog;
