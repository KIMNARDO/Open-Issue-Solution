import { faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@mui/material';
import { Button, CircularProgress } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community';

interface MultiFileUploadRendererProps extends ICellRendererParams {
  editable?: boolean;
  isUploading?: boolean;
  openFileUploader?: (data: any) => void;
}

const MultiFileUploadRenderer = ({ editable, isUploading, openFileUploader, data }: MultiFileUploadRendererProps) => {
  if (data.isNew) return null;
  const hasFile = data?.isFileYn === 'Y';
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          position: 'relative'
        }}
      >
        <Button
          variant="outlined"
          size="small"
          color={hasFile ? 'success' : undefined}
          onClick={() => {
            openFileUploader?.(data);
          }}
          disabled={isUploading || !editable}
          startIcon={isUploading ? <CircularProgress size={16} /> : <FontAwesomeIcon icon={faCloudUpload} />}
          sx={{
            width: '100%',
            height: '100%',
            borderStyle: 'dashed',
            borderWidth: 1,
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': {
              borderStyle: 'dashed',
              borderWidth: 1
            }
          }}
        >
          {isUploading ? 'Uploading...' : '파일 업로드'}
        </Button>
      </Box>
    </>
  );
};

export default MultiFileUploadRenderer;
