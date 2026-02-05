import { CircularProgress } from '@mui/material';
import { CommonFile } from 'api/file/file.types';
import FilePreview from 'reactjs-file-preview';
import axiosServices from 'utils/axios';

const getFileType = (file: CommonFile) => {
  switch (file.ext?.toLowerCase().replaceAll('.', '')) {
    case 'pdf':
      return 'pdf';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return 'image';
    default:
      return undefined;
  }
};

const ThumbnailViewer = ({ selectedFile }: { selectedFile: CommonFile }) => {
  return (
    <FilePreview
      preview={`${import.meta.env.VITE_APP_API_URL}/common/download/attachedFile/231412412`}
      axiosInstance={axiosServices}
      fileType={getFileType(selectedFile)}
      errorImage="assets/error.png"
      getLoader={() => <CircularProgress size={20} />}
    />
  );
};

export default ThumbnailViewer;
