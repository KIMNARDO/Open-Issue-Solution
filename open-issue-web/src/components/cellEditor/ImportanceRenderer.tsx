import { Box, Chip } from '@mui/material';
import { CustomCellRendererProps } from 'ag-grid-react';

// 중요도 색상 매핑
const importanceColors: Record<string, { bg: string; color: string; label: string }> = {
  '1': { bg: '#e3f2fd', color: '#1565c0', label: '하' },
  '2': { bg: '#fff3e0', color: '#ef6c00', label: '중' },
  '3': { bg: '#ffebee', color: '#c62828', label: '상' },
  '4': { bg: '#f3e5f5', color: '#7b1fa2', label: '지시사항' },
  '5': { bg: '#fce4ec', color: '#ad1457', label: '긴급' }
};

interface ImportanceRendererProps extends CustomCellRendererProps {
  value?: string;
}

export const ImportanceRenderer = ({ value, data }: ImportanceRendererProps) => {
  // value가 없으면 data.importance 사용
  const importance = value || data?.importance;

  if (!importance) {
    return <Box sx={{ textAlign: 'center' }}>-</Box>;
  }

  const config = importanceColors[importance] || { bg: '#f5f5f5', color: '#757575', label: importance };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Chip
        label={config.label}
        size="small"
        sx={{
          backgroundColor: config.bg,
          color: config.color,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: '24px',
          minWidth: '48px',
          '& .MuiChip-label': {
            px: 1
          }
        }}
      />
    </Box>
  );
};

// 중요도 이름으로 표시할 때 사용
export const ImportanceNameRenderer = ({ value, data }: ImportanceRendererProps) => {
  const importanceName = value || data?.importanceNm;

  if (!importanceName) {
    return <Box sx={{ textAlign: 'center' }}>-</Box>;
  }

  // 이름으로 색상 찾기
  const nameToConfig: Record<string, { bg: string; color: string }> = {
    '하': { bg: '#e3f2fd', color: '#1565c0' },
    '중': { bg: '#fff3e0', color: '#ef6c00' },
    '상': { bg: '#ffebee', color: '#c62828' },
    '지시사항': { bg: '#f3e5f5', color: '#7b1fa2' },
    '긴급': { bg: '#fce4ec', color: '#ad1457' }
  };

  const config = nameToConfig[importanceName] || { bg: '#f5f5f5', color: '#757575' };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Chip
        label={importanceName}
        size="small"
        sx={{
          backgroundColor: config.bg,
          color: config.color,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: '24px',
          minWidth: '48px',
          '& .MuiChip-label': {
            px: 1
          }
        }}
      />
    </Box>
  );
};

export default ImportanceRenderer;
