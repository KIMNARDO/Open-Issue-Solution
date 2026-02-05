import { Box } from '@mui/material';
import { CommonFile } from 'api/file/file.types';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import useFileUploader from 'components/fileUploader/useFileUploader';
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle } from 'react';

interface FileUploadDialogProps {
  BasicDialog: ReturnType<typeof useBasicDialog>['BasicDialog'];
  handleClose: ReturnType<typeof useBasicDialog>['handleClose'];
  onChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => void;
  defaultFiles?: CommonFile[];
  handleDelete?: (file: CommonFile) => void;
  isAccessible?: boolean;
  types?: string[];
  isLoading?: boolean;
}

export interface FileUploadDialogRef {
  reset: () => void;
}

const FileUploadDialog = forwardRef(
  (
    {
      BasicDialog,
      handleClose,
      onChange,
      onUpload,
      defaultFiles,
      handleDelete,
      isAccessible = true,
      types,
      isLoading
    }: FileUploadDialogProps,
    ref: ForwardedRef<FileUploadDialogRef>
  ) => {
    const { FileUploader, uploadedFile, reset } = useFileUploader({
      name: 'file',
      multiple: true,
      types,
      dropMsg: '드롭하여 업로드',
      displayFiles: true,
      defaultFiles: defaultFiles,
      handleDelete,
      isAccessible,
      isLoading
    });

    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          reset();
        }
      }),
      []
    );

    const handleConfirm = () => {
      onUpload?.(uploadedFile ?? []);
      handleClose();
    };

    useEffect(() => {
      if (uploadedFile) {
        onChange?.(uploadedFile);
      }
    }, [uploadedFile]);

    return (
      <>
        <BasicDialog
          options={{
            title: '파일 업로드',
            confirmText: '업로드',
            cancelText: '닫기'
          }}
          closeCallback={() => {
            reset();
          }}
          actionButtons={true}
          handleConfirm={handleConfirm}
        >
          <Box sx={{ height: '50vh', width: '40vw', overflow: 'auto', px: 5, pt: 5, pb: 2, display: 'flex', flexDirection: 'column' }}>
            {FileUploader}
          </Box>
        </BasicDialog>
      </>
    );
  }
);

export default FileUploadDialog;
