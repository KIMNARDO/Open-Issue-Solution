import { Backdrop, Box, Dialog, DialogContent, Fade, IconButton, Paper, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faExpand,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { CommonFile } from 'api/file/file.types';
import { styled } from '@mui/system';
import fileService from 'api/file/fileService';

const ErrorRenderer = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Typography variant="h6">해당 파일이 존재하지 않거나 불러올 수 없습니다</Typography>
    </Box>
  );
};

interface ImageViewerProps {
  selectedFile?: CommonFile;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    boxShadow: 'none',
    maxWidth: '100vw',
    maxHeight: '100vh',
    margin: 0,
    borderRadius: 0
  }
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
  display: 'flex',
  gap: theme.spacing(1)
}));

const InfoPanel = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1)
}));

const PdfContainer = styled(Box)({
  position: 'relative',
  width: '100vw',
  height: '100vh',
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
});

const NavigationContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(8),
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

export const PdfViewer: React.FC<ImageViewerProps> = ({
  selectedFile,
  open,
  setOpen,
  alt = 'Image',
  width = 'auto',
  height = 'auto',
  className = ''
}) => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const [scale, setScale] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const downloadandConvertToUrl = async (file: CommonFile) => {
    const res = await fileService.downloadFile(file.fileOid);

    // Content-Type 확인 (선택사항)
    const contentType = res.headers['content-type'];
    if (contentType && !contentType.includes('application/pdf')) {
      console.warn('응답이 PDF가 아닐 수 있습니다:', contentType);
    }

    const blob = res.data;
    setFileUrl(URL.createObjectURL(blob));
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const resetZoom = useCallback(() => {
    setScale(1);
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev * 1.2, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev / 1.2, 0.1));
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(0.1, Math.min(5, prev * delta)));
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setScale(1);
    setPageNumber(1);
  }, [setOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        closeDialog();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, closeDialog]);

  useEffect(() => {
    setScale(1);
    setPageNumber(1);
  }, [open]);

  useEffect(() => {
    return () => {
      fileUrl && URL.revokeObjectURL(fileUrl);
    };
  }, []);

  useEffect(() => {
    if (!selectedFile) return;
    downloadandConvertToUrl(selectedFile);
  }, [selectedFile]);

  return (
    <>
      {/* Dialog Modal */}
      <StyledDialog
        open={open}
        onClose={closeDialog}
        fullScreen
        TransitionComponent={Fade}
        slots={{
          backdrop: Backdrop
        }}
        slotProps={{
          backdrop: {
            timeout: 300,
            sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          {/* Controls */}
          <ControlsContainer>
            <IconButton
              onClick={handleZoomIn}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
              }}
              size="large"
            >
              <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
            </IconButton>
            <IconButton
              onClick={handleZoomOut}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
              }}
              size="large"
            >
              <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
            </IconButton>
            <IconButton
              onClick={resetZoom}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
              }}
              size="large"
            >
              <FontAwesomeIcon icon={faExpand} />
            </IconButton>
            <IconButton
              onClick={closeDialog}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
              }}
              size="large"
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </ControlsContainer>

          {/* PDF Container */}
          <PdfContainer ref={containerRef} onWheel={handleWheel}>
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={() => {}} error={<ErrorRenderer />}>
              <Page pageNumber={pageNumber} scale={scale} />
            </Document>
          </PdfContainer>

          {/* Navigation Controls */}
          {numPages && (
            <NavigationContainer>
              <IconButton onClick={() => setPageNumber((prev) => prev - 1)} disabled={pageNumber <= 1} sx={{ color: 'white' }} size="small">
                <FontAwesomeIcon icon={faChevronLeft} />
              </IconButton>
              <Typography variant="body2" sx={{ color: 'white', mx: 1 }}>
                Page {pageNumber} of {numPages}
              </Typography>
              <IconButton
                onClick={() => setPageNumber((prev) => prev + 1)}
                disabled={pageNumber >= numPages}
                sx={{ color: 'white' }}
                size="small"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </IconButton>
            </NavigationContainer>
          )}

          {/* Info Panel */}
          <InfoPanel>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Zoom: {Math.round(scale * 100)}%
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              스크롤: 배율 조절 • ESC: 닫기
            </Typography>
          </InfoPanel>
        </DialogContent>
      </StyledDialog>
    </>
  );
};

export default PdfViewer;
