import { Box, Chip } from '@mui/material';
import { CustomCellRendererProps } from 'ag-grid-react';
import { useIntl } from 'react-intl';

// 상태별 색상 매핑 (Smartsheet 스타일)
const statusConfig: Record<string, { bg: string; color: string; borderColor: string; labelKey: string }> = {
  // 진행 상태
  '78102': { bg: '#e3f2fd', color: '#1565c0', borderColor: '#1976d2', labelKey: 'issue-state-open' },
  '진행': { bg: '#e3f2fd', color: '#1565c0', borderColor: '#1976d2', labelKey: 'issue-state-open' },
  '진행중': { bg: '#e3f2fd', color: '#1565c0', borderColor: '#1976d2', labelKey: 'issue-state-open' },
  // 완료 상태
  '78106': { bg: '#e8f5e9', color: '#2e7d32', borderColor: '#388e3c', labelKey: 'issue-state-closed' },
  '완료': { bg: '#e8f5e9', color: '#2e7d32', borderColor: '#388e3c', labelKey: 'issue-state-closed' },
  // 대기 상태
  '78104': { bg: '#fff3e0', color: '#e65100', borderColor: '#f57c00', labelKey: 'issue-state-pending' },
  '대기': { bg: '#fff3e0', color: '#e65100', borderColor: '#f57c00', labelKey: 'issue-state-pending' }
};

interface IssueStatusRendererProps extends CustomCellRendererProps {
  value?: string;
}

export const IssueStatusRenderer = ({ value, data }: IssueStatusRendererProps) => {
  const { formatMessage } = useIntl();

  // value가 없으면 data.issueState 사용
  const status = value || data?.issueState;

  if (!status) {
    return <Box sx={{ textAlign: 'center' }}>-</Box>;
  }

  const config = statusConfig[status] || statusConfig[data?.issueStateNm];

  if (!config) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Chip
          label={data?.issueStateNm || status}
          size="small"
          sx={{
            backgroundColor: '#f5f5f5',
            color: '#757575',
            fontWeight: 600,
            fontSize: '0.75rem',
            height: '24px',
            minWidth: '56px'
          }}
        />
      </Box>
    );
  }

  const label = formatMessage({ id: config.labelKey });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Chip
        label={label}
        size="small"
        sx={{
          backgroundColor: config.bg,
          color: config.color,
          border: `2px solid ${config.borderColor}`,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: '24px',
          minWidth: '56px',
          '& .MuiChip-label': {
            px: 1
          }
        }}
      />
    </Box>
  );
};

// 진행률 바 스타일 (Smartsheet 스타일 - 수평 프로그레스)
export const IssueProgressRenderer = ({ value, data }: IssueStatusRendererProps) => {
  const status = value || data?.issueState;

  // 상태별 진행률
  const progressMap: Record<string, number> = {
    '78102': 50, // 진행
    '진행': 50,
    '진행중': 50,
    '78104': 25, // 대기
    '대기': 25,
    '78106': 100, // 완료
    '완료': 100
  };

  const progress = progressMap[status] || progressMap[data?.issueStateNm] || 0;

  // 진행률에 따른 색상
  const getProgressColor = (p: number) => {
    if (p >= 100) return '#4caf50';
    if (p >= 50) return '#2196f3';
    if (p >= 25) return '#ff9800';
    return '#e0e0e0';
  };

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      px: 1
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: 80,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
        overflow: 'hidden'
      }}>
        <Box sx={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: getProgressColor(progress),
          borderRadius: 4,
          transition: 'width 0.3s ease'
        }} />
      </Box>
    </Box>
  );
};

export default IssueStatusRenderer;
