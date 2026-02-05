import { useTheme } from '@mui/material';
import { CustomCellRendererProps } from 'ag-grid-react';
import { ProgressBar } from 'pages/project/detail/section/common/ProgressBar';

const ProgressbarRenderer = ({ value }: CustomCellRendererProps) => {
  const { palette } = useTheme();
  return <ProgressBar value={value} completedColor={palette.success.main} progressColor={palette.warning.main} showPercentage={false} />;
};

export default ProgressbarRenderer;
