import { Box } from '@mui/material';
import { CommonFile } from 'api/file/file.types';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import SimpleGrid from 'components/grid/SimpleGrid';
import { ExColDef, ExColGroupDef } from 'components/grid/grid.types';
import { useMemo } from 'react';

interface DownloadHistoryDialogProps {
  BasicDialog: ReturnType<typeof useBasicDialog>['BasicDialog'];
  file?: CommonFile;
}

const DownloadHistoryDialog = ({ BasicDialog, file }: DownloadHistoryDialogProps) => {
  const columns = useMemo<(ExColDef | ExColGroupDef)[]>(() => {
    return [
      {
        field: 'no',
        headerName: 'No',
        cellDataType: 'index'
      },
      {
        field: 'regUserName',
        headerName: '사용자명'
      },
      {
        field: 'regDt',
        headerName: '다운로드 일시'
      },
      {
        field: 'result',
        headerName: '결과'
      }
    ];
  }, []);

  return (
    <>
      <BasicDialog
        options={{
          title: '다운로드 이력'
        }}
      >
        <Box sx={{ height: '50vh', width: '40vw', overflow: 'auto' }}>
          <SimpleGrid gridProps={{ rowData: [], columnDefs: columns }} />
        </Box>
      </BasicDialog>
    </>
  );
};

export default DownloadHistoryDialog;
