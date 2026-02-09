import { Paper, Typography, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { DelayedIssueItem } from '../dashboard.types';
import { useIntl } from 'react-intl';
import { AlertTriangle } from 'lucide-react';

const FIGMA_EASING = 'cubic-bezier(0.46, 0.03, 0.52, 0.96)';
const FIGMA_SHADOW =
  '0px 16px 48px 0px rgba(17,24,39,0.04), 0px 12px 24px 0px rgba(17,24,39,0.04), 0px 6px 8px 0px rgba(17,24,39,0.02), 0px 2px 3px 0px rgba(17,24,39,0.02)';

// Figma importance highlight colors
const importanceBadges: Record<string, { bg: string; color: string }> = {
  '1': { bg: 'rgb(248, 248, 247)', color: 'rgba(83, 86, 90, 1)' },
  '2': { bg: '#e0f2fe', color: '#2563eb' },
  '3': { bg: 'rgb(251, 236, 221)', color: '#c2410c' },
  '4': { bg: '#f3e8ff', color: '#7c3aed' },
  '5': { bg: '#ffe4e6', color: '#dc2626' }
};

const delayColors = (delay: number) => {
  if (delay >= 8) return { bg: '#ffe4e6', color: '#dc2626' };
  if (delay >= 4) return { bg: 'rgb(251, 236, 221)', color: '#c2410c' };
  return { bg: '#fef9c3', color: '#a16207' };
};

interface DelayedIssueListProps {
  data: DelayedIssueItem[];
  title: string;
}

const DelayedIssueList = ({ data, title }: DelayedIssueListProps) => {
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Box display="flex" alignItems="center" gap={1}>
          <AlertTriangle size={16} color="#E41B23" />
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
        <Box
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: '20px',
            fontSize: '0.625rem',
            fontWeight: 700,
            backgroundColor: '#ffe4e6',
            color: '#dc2626',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          {data.length}
          {formatMessage({ id: 'dash-count-suffix' })}
        </Box>
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
            {formatMessage({ id: 'dash-no-delayed' })}
          </Box>
        ) : (
          data.map((issue, idx) => {
            const dc = delayColors(issue.delay);
            const ic = importanceBadges[issue.importance] || { bg: '#f5f5f5', color: '#757575' };
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
                      fontWeight: 700,
                      backgroundColor: dc.bg,
                      color: dc.color,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    +{issue.delay}
                    {formatMessage({ id: 'dash-days' })}
                  </Box>
                  <Box
                    sx={{
                      px: 0.75,
                      py: 0.15,
                      borderRadius: '4px',
                      fontSize: '0.5625rem',
                      fontWeight: 600,
                      backgroundColor: ic.bg,
                      color: ic.color,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {issue.importanceNm}
                  </Box>
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

export default DelayedIssueList;
