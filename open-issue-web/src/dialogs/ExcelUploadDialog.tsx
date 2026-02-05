import { Box } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { commonNotification } from 'api/common/notification';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import useFileUploader from 'components/fileUploader/useFileUploader';
import CommonGrid from 'components/grid/CommonGrid';
import { ExColDef, ExColGroupDef } from 'components/grid/grid.types';
import { useEditGrid } from 'components/grid/useEditGrid';
import { useEffect, useRef, useState } from 'react';
import { parseExcelFile } from 'utils/parseExcel';

interface ExcelUploadDialogProps<T> {
  BasicDialog: ReturnType<typeof useBasicDialog>['BasicDialog'];
  handleClose: ReturnType<typeof useBasicDialog>['handleClose'];
  keys: (keyof T)[];
  columnDefs: (ExColDef | ExColGroupDef)[];
  initRow?: T;
  onChange?: (files: File[]) => void;
  onUpload?: (data: any[]) => void;
  isLoading?: boolean;
}

export interface FileUploadDialogRef {
  reset: () => void;
}

const ExcelUploadDialog = <T,>({
  BasicDialog,
  handleClose,
  onChange,
  onUpload,
  isLoading,
  initRow,
  keys,
  columnDefs
}: ExcelUploadDialogProps<T>) => {
  const [rowData, setRowData] = useState<any[]>([]);
  const { FileUploader, uploadedFile, reset } = useFileUploader({
    name: 'file',
    multiple: false,
    types: ['xlsx', 'xls'],
    dropMsg: '드롭하여 업로드',
    displayFiles: false,
    isLoading
  });

  const gridRef = useRef<AgGridReact>(null);

  const { onUpdateCells } = useEditGrid(gridRef);

  const handleConfirm = () => {
    if (rowData.length < 1) {
      commonNotification.warn('업로드할 데이터가 없습니다');
      return;
    }
    onUpload?.(rowData);
    handleClose();
  };

  useEffect(() => {
    if (uploadedFile) {
      onChange?.(uploadedFile);
      parseExcelFile(uploadedFile[0], keys).then((res) => {
        if (initRow) {
          setRowData(res.map((item) => ({ ...initRow, ...item })));
        } else {
          setRowData(res);
        }
      });
    }
  }, [uploadedFile]);

  return (
    <>
      <BasicDialog
        options={{
          title: '엑셀파일 업로드',
          confirmText: '업로드',
          cancelText: '닫기'
        }}
        closeCallback={() => {
          reset();
          setRowData([]);
        }}
        actionButtons={true}
        handleConfirm={handleConfirm}
      >
        <Box
          sx={{ height: '50vh', width: '40vw', overflow: 'auto', px: 5, pt: 5, pb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 100 }}>{FileUploader}</Box>
          <CommonGrid gridProps={{ rowData, columnDefs, onCellValueChanged: onUpdateCells }} noDataMsg="업로드 내용이 없습니다" />
        </Box>
      </BasicDialog>
    </>
  );
};

export default ExcelUploadDialog;
