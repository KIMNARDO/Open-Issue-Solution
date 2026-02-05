import { Box } from '@mui/material';
import { useGetApprovalComments } from 'api/user-task/useTaskService';
import { GridSelectFormatter } from 'components/cellEditor/SelectEditor';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import { ExColDef, ExColGroupDef } from 'components/grid/grid.types';
import SimpleGrid from 'components/grid/SimpleGrid';
import useLibrary from 'hooks/useLibrary';
import { useMemo } from 'react';

//결재선 상세 확인 dialog

interface ApprovalDialogProps {
  BasicDialog: ReturnType<typeof useBasicDialog>['BasicDialog'];
  handleClose: ReturnType<typeof useBasicDialog>['handleClose'];
  approvalUid: number;
}
const ApprovalLineDialog = ({ BasicDialog, handleClose, approvalUid }: ApprovalDialogProps) => {
  const { data } = useGetApprovalComments(approvalUid);

  const { librarySelect } = useLibrary();

  const columns = useMemo<(ExColDef | ExColGroupDef)[]>(() => {
    return [
      {
        field: 'ord',
        headerName: '순서',
        maxWidth: 60,
        valueFormatter: ({ value }) => value || '-'
      },
      {
        field: 'approvalType',
        headerName: '역할',
        maxWidth: 90,
        valueFormatter: GridSelectFormatter,
        context: {
          selectOption: librarySelect.APPROVAL_ROLE
        }
      },
      {
        field: 'userName',
        headerName: '이름',
        maxWidth: 120
      },
      {
        field: 'status',
        headerName: '결과',
        maxWidth: 90
      },
      {
        field: 'comment',
        headerName: '결재 코멘트',
        valueFormatter: (params) => params.value || '-'
      }
    ];
  }, []);

  return (
    <BasicDialog
      options={{
        title: '결재선 상세'
      }}
    >
      <Box sx={{ mt: 1, width: 800, height: 400 }}>
        <SimpleGrid
          gridProps={{
            rowData: data || [],
            columnDefs: columns
          }}
        />
      </Box>
    </BasicDialog>
  );
};

export default ApprovalLineDialog;
