import { forwardRef, JSXElementConstructor, useEffect, useImperativeHandle, useState } from 'react';
import { Drawer, Box, Typography } from '@mui/material';
import FileList from 'components/list/FileList';
import { CommonFile } from 'api/file/file.types';
import PdfViewer from 'components/viewer/PdfViewer';
import ImageViewer from 'components/viewer/ImageViewer';
import useFileUploader from 'components/fileUploader/useFileUploader';
import { Stack } from '@mui/material';
import CommonButton from 'components/buttons/CommonButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUpload } from '@fortawesome/free-solid-svg-icons';

interface FileUploadDrawerProps {
  files: CommonFile[];
  width?: number;
  onUpload: (files: File[]) => void;
  onFileDelete?: (file: CommonFile) => void;
  Actions?: JSXElementConstructor<any>;
}

export interface FileUploadDrawerRef {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const FileUploadDrawer = forwardRef<FileUploadDrawerRef, FileUploadDrawerProps>(
  ({ files, width = 480, onUpload, onFileDelete, Actions }, ref) => {
    // 상태 관리
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<CommonFile>();
    const [addedFile, setAddedFile] = useState<File[]>([]);
    const [isPdfViewerOpen, setIsPdfViewerOpen] = useState<boolean>(false);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      isOpen
    }));

    const handleFileDelete = (file: CommonFile) => {
      onFileDelete?.(file);
    };

    const handleUpload = () => {
      onUpload(addedFile);
      setAddedFile([]);
      reset();
    };

    const { FileUploader, uploadedFile, reset } = useFileUploader({
      name: 'file',
      defaultFiles: files,
      displayFiles: false,
      multiple: true
    });

    useEffect(() => {
      setAddedFile(uploadedFile ?? []);
    }, [uploadedFile]);

    return (
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setAddedFile([]);
          reset();
        }}
        variant="temporary"
        sx={{
          '& .MuiDrawer-paper': {
            width: width,
            boxSizing: 'border-box',
            paddingTop: '60px'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 1, gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="h3">🔗 첨부파일</Typography>
            <Stack flexDirection={'row'}>{Actions && <Actions />}</Stack>
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto', border: '1px solid #ccc' }}>
            <FileList
              files={files}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              addedFile={addedFile}
              setAddedFile={(file) => {
                setAddedFile(file);
                reset(file);
              }}
              isDeleteable
              handleDeleteFile={handleFileDelete}
              openPdfDialog={() => {
                setIsPdfViewerOpen(true);
              }}
              openImageDialog={() => {
                setIsImageViewerOpen(true);
              }}
            />
          </Box>
          <Box height={300}>{FileUploader}</Box>
          <Stack direction="row" spacing={1} justifyContent="center">
            <CommonButton title="업로드" variant="outlined" icon={<FontAwesomeIcon icon={faCloudUpload} />} onClick={handleUpload} />
          </Stack>
        </Box>
        {/* <FileUploadDialog BasicDialog={BasicDialog} handleClose={handleClose} onUpload={handleUpload} /> */}
        <PdfViewer open={isPdfViewerOpen} setOpen={setIsPdfViewerOpen} selectedFile={selectedFile} />
        <ImageViewer open={isImageViewerOpen} setOpen={setIsImageViewerOpen} src={selectedFile ?? ''} />
      </Drawer>
    );
  }
);

FileUploadDrawer.displayName = 'FileUploadDrawer';

export default FileUploadDrawer;
