import { Paper, Typography, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { RecentIssueItem } from '../dashboard.types';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { Clock } from 'lucide-react';

const FIGMA_EASING = 'cubic-bezier(0.46, 0.03, 0.52, 0.96)';
const FIGMA_SHADOW =
  '0px 16px 48px 0px rgba(17,24,39,0.04), 0px 12px 24px 0px rgba(17,24,39,0.04), 0px 6px 8px 0px rgba(17,24,39,0.02), 0px 2px 3px 0px rgba(17,24,39,0.02)';

// Figma state badge colors
const stateBadges: Record<string, { bg: string; color: string }> = {
  진행중: { bg: '#e0f2fe', color: '#2563eb' },
  진행: { bg: '#e0f2fe', color: '#2563eb' },
  검토중: { bg: '#e0f2fe', color: '#2563eb' },
  완료: { bg: '#dcfce7', color: '#16a34a' },
  대기: { bg: '#fef9c3', color: '#a16207' }
};

interface RecentIssueListProps {
  data: RecentIssueItem[];
  title: string;
}

const RecentIssueList = ({ data, title }: RecentIssueListProps) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '12px',
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: `all 0.2s ${FIGMA_EASING}`,
        '&:hover': {
          boxShadow: FIGMA_SHADOW,
          borderColor: alpha(theme.palette.primary.main, 0.15)
        }
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={1.5}>
        <Clock size={16} color="#3B82F6" />
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'rgba(44, 45, 48, 1)'
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Issue List */}
      <Box sx={{ flex: 1, overflow: 'auto', mx: -0.5 }}>
        {data.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              color: 'rgba(166, 167, 171, 1)',
              fontSize: '0.75rem'
            }}
          >
            {formatMessage({ id: 'msg-no-data' })}
          </Box>
        ) : (
          data.map((issue, idx) => {
            const sb = stateBadges[issue.issueStateNm] || { bg: '#f5f5f5', color: '#757575' };
            return (
              <Box
                key={issue.oid}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: '6px',
                  transition: `background 0.15s ${FIGMA_EASING}`,
                  '&:hover': {
                    backgroundColor: 'rgba(250, 250, 250, 1)'
                  },
                  borderBottom: idx < data.length - 1 ? '1px solid rgba(234, 234, 235, 0.7)' : 'none'
                }}
              >
                <Box display="flex" alignItems="center" gap={0.75} mb={0.5}>
                  <Typography
                    sx={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: 'rgba(83, 86, 90, 1)',
                      minWidth: 70
                    }}
                  >
                    {issue.issueNo}
                  </Typography>
                  <Box
                    sx={{
                      px: 0.75,
                      py: 0.15,
                      borderRadius: '4px',
                      fontSize: '0.5625rem',
                      fontWeight: 600,
                      backgroundColor: sb.bg,
                      color: sb.color,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {issue.issueStateNm || '-'}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '0.5625rem',
                      fontWeight: 500,
                      color: 'rgba(166, 167, 171, 1)',
                      ml: 'auto'
                    }}
                  >
                    {dayjs(issue.strDt).format('MM.DD')}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    fontWeight: 400,
                    color: 'rgba(125, 127, 130, 1)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%'
                  }}
                >
                  {issue.contents.split('\n')[0]}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>
    </Paper>
  );
};

export default RecentIssueList;
