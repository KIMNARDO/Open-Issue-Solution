import { CustomCellRendererProps } from 'ag-grid-react';

const ThumbnailRenderer = ({ value }: CustomCellRendererProps) => {
  return (
    <>
      <img src={value ?? ''} alt="thumbnailrenderer" style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
    </>
  );
};

export default ThumbnailRenderer;
