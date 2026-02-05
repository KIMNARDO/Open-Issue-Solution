import React, { useState, useRef, useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent, IconButton, Box, Typography, Paper, Fade, Backdrop } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faMagnifyingGlassMinus, faMagnifyingGlassPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { CommonFile } from 'api/file/file.types';
import fileService from 'api/file/fileService';

interface ImageViewerProps {
  src: string | CommonFile;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
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

const ImageContainer = styled(Box)({
  position: 'relative',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  cursor: 'grab',
  '&.dragging': {
    cursor: 'grabbing'
  }
});

// const ThumbnailContainer = styled(Box)(({ theme }) => ({
//   position: 'relative',
//   display: 'inline-block',
//   cursor: 'pointer',
//   overflow: 'hidden',
//   borderRadius: theme.spacing(1),
//   transition: 'transform 0.2s ease-in-out',
//   '&:hover': {
//     transform: 'scale(1.05)',
//     '& .overlay': {
//       opacity: 1
//     }
//   }
// }));

// const HoverOverlay = styled(Box)(({ theme }) => ({
//   position: 'absolute',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: 'rgba(0, 0, 0, 0.3)',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   opacity: 0,
//   transition: 'opacity 0.2s ease-in-out',
//   borderRadius: theme.spacing(1)
// }));

const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  open,
  setOpen,
  alt = 'Image',
  width = 'auto',
  height = 'auto',
  className = ''
}) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    translateX: 0,
    translateY: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTransform, setLastTransform] = useState<Transform>({
    scale: 1,
    translateX: 0,
    translateY: 0
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const downloadandConvertToUrl = async (file: CommonFile) => {
    const res = await fileService.downloadFile(file.fileOid);

    const blob = res.data;
    setImgSrc(URL.createObjectURL(blob));
  };

  const resetTransform = useCallback(() => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
  }, []);

  const handleZoomIn = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, 5)
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, 0.1)
    }));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setLastTransform(transform);
    },
    [transform]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setTransform({
        ...lastTransform,
        translateX: lastTransform.translateX + deltaX,
        translateY: lastTransform.translateY + deltaY
      });
    },
    [isDragging, dragStart, lastTransform]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.1, Math.min(5, prev.scale * delta))
    }));
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    resetTransform();
  }, [resetTransform, setOpen]);

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
    resetTransform();
  }, [open]);

  useEffect(() => {
    if (src) {
      if (typeof src === 'string') {
        setImgSrc(src);
      } else {
        downloadandConvertToUrl(src);
      }
    }
  }, [src]);

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
              onClick={resetTransform}
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

          {/* Image Container */}
          <ImageContainer
            ref={containerRef}
            className={isDragging ? 'dragging' : ''}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <img
              ref={imageRef}
              src={imgSrc}
              alt={alt}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                maxWidth: 'none',
                userSelect: 'none',
                transform: `translate(-50%, -50%) translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
              draggable={false}
            />
          </ImageContainer>

          {/* Info Panel */}
          <InfoPanel>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Zoom: {Math.round(transform.scale * 100)}%
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              드래그: 이동 • 스크롤: 배율 조절 • ESC: 닫기
            </Typography>
          </InfoPanel>
        </DialogContent>
      </StyledDialog>
    </>
  );
};

export default ImageViewer;
