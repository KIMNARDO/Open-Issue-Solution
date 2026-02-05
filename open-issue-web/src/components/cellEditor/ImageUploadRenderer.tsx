import React, { useState, useRef } from 'react';
import { ICellRendererParams, IRowNode } from 'ag-grid-community';
import { Box, Button, IconButton, Avatar, Tooltip, CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUpload, faEdit, faImage, faTrash } from '@fortawesome/free-solid-svg-icons';
import { commonNotification } from 'api/common/notification';
import ImageViewer from 'components/viewer/ImageViewer';
import { convertBase64ToDataUrl } from 'utils/commonUtils';

interface ImageUploadCellRendererProps extends ICellRendererParams {
  data: any;
  value: string | null; // URL of the uploaded image
  onImageUpload?: (file: File, rowData: any) => Promise<string>; // Returns uploaded image URL
  onImageRemove?: (node: IRowNode) => void;
  maxFileSize?: number; // in bytes, default 5MB
  acceptedTypes?: string[]; // default: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  editable?: boolean;
}

const ImageUploadCellRenderer: React.FC<ImageUploadCellRendererProps> = ({
  data,
  value,
  onImageUpload,
  onImageRemove,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  api,
  node,
  colDef,
  editable = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value ? convertBase64ToDataUrl((value as any).base64) : null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      const errorMsg = `Invalid file type. Accepted: ${acceptedTypes.map((type) => type.split('/')[1]).join(', ')}`;
      commonNotification.error(errorMsg);
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      const errorMsg = `File too large. Max size: ${(maxFileSize / (1024 * 1024)).toFixed(1)}MB`;
      commonNotification.error(errorMsg);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file if handler provided
    if (onImageUpload) {
      setIsUploading(true);
      try {
        const uploadedUrl = await onImageUpload(file, data);

        // Update the cell value
        node.setDataValue(colDef?.field!, file);

        // Refresh the grid to reflect changes
        api?.refreshCells({ rowNodes: [node], force: true });

        setPreviewUrl(uploadedUrl);
      } catch (uploadError) {
        const errorMsg = 'Upload failed. Please try again.';
        commonNotification.error(errorMsg);
        console.error('Image upload error:', uploadError);
        setPreviewUrl(value); // Revert to original value
      } finally {
        setIsUploading(false);
      }
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageRemove?.(node);
    // Update the cell value to null
    node.setDataValue(colDef?.field!, null);

    // Refresh the grid to reflect changes
    api?.refreshCells({ rowNodes: [node], force: true });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        p: 0.5,
        position: 'relative'
      }}
    >
      <input ref={fileInputRef} type="file" accept={acceptedTypes.join(',')} onChange={handleFileSelect} style={{ display: 'none' }} />

      {previewUrl ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            width: '100%',
            height: '100%'
          }}
        >
          <Avatar
            onClick={() => setViewerOpen(true)}
            src={previewUrl}
            alt="Uploaded"
            variant="rounded"
            sx={{
              flexGrow: 1,
              height: '100%',
              maxHeight: 60,
              width: 'auto',
              aspectRatio: '1/1',
              border: '2px solid',
              borderColor: 'primary.main',
              cursor: 'pointer',
              '& .MuiAvatar-img': {
                objectFit: 'cover'
              }
            }}
          >
            <FontAwesomeIcon icon={faImage} />
          </Avatar>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.25,
              minWidth: 'fit-content'
            }}
            onClick={(e) => e.preventDefault()}
          >
            <Tooltip title="Replace image">
              <IconButton
                size="small"
                onClick={handleUploadClick}
                disabled={isUploading || !editable}
                color="primary"
                sx={{ p: 0.25, minWidth: 24, minHeight: 24 }}
              >
                {isUploading ? <CircularProgress size={12} /> : <FontAwesomeIcon icon={faEdit} />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Remove image">
              <IconButton
                size="small"
                onClick={handleRemoveImage}
                disabled={isUploading || !editable}
                color="error"
                sx={{ p: 0.25, minWidth: 24, minHeight: 24 }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ) : (
        <Button
          variant="outlined"
          size="small"
          onClick={handleUploadClick}
          disabled={isUploading || !editable}
          startIcon={isUploading ? <CircularProgress size={16} /> : <FontAwesomeIcon icon={faCloudUpload} />}
          sx={{
            width: '100%',
            height: '100%',
            borderStyle: 'dashed',
            borderWidth: 2,
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': {
              borderStyle: 'dashed',
              borderWidth: 2
            }
          }}
        >
          {isUploading ? 'Uploading...' : '이미지 업로드'}
        </Button>
      )}
      <ImageViewer src={previewUrl || ''} open={viewerOpen} setOpen={setViewerOpen} alt="Uploaded" />
    </Box>
  );
};

export default ImageUploadCellRenderer;
