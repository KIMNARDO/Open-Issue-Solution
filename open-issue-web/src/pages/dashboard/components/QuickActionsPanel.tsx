import { Paper, Typography, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { PlusCircle, BarChart3, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

const FIGMA_EASING = 'cubic-bezier(0.46, 0.03, 0.52, 0.96)';
const FIGMA_SHADOW =
  '0px 16px 48px 0px rgba(17,24,39,0.04), 0px 12px 24px 0px rgba(17,24,39,0.04), 0px 6px 8px 0px rgba(17,24,39,0.02), 0px 2px 3px 0px rgba(17,24,39,0.02)';

const ACTIONS = [
  { key: 'log-issue', icon: PlusCircle, color: '#3B82F6', labelKey: 'dash-log-issue', path: '/Qms/OpenIssueList' },
  { key: 'gen-report', icon: BarChart3, color: '#f97316', labelKey: 'dash-gen-report', path: null },
  { key: 'kanban', icon: LayoutGrid, color: '#8b5cf6', labelKey: 'dash-kanban-view', path: '/Qms/OpenIssueList' },
  { key: 'issue-list', icon: List, color: '#52c41a', labelKey: 'dash-issue-list', path: '/Qms/OpenIssueList' }
];

interface QuickActionsPanelProps {
  onGenReport?: () => void;
}

const QuickActionsPanel = ({ onGenReport }: QuickActionsPanelProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const handleAction = (action: typeof ACTIONS[number]) => {
    if (action.key === 'gen-report' && onGenReport) {
      onGenReport();
    } else if (action.path) {
      navigate(action.path);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '12px',
        border: `1px solid ${theme.palette.divider}`,
        transition: `all 0.2s ${FIGMA_EASING}`,
        '&:hover': {
          boxShadow: FIGMA_SHADOW,
          borderColor: alpha(theme.palette.primary.main, 0.15)
        }
      }}
    >
      <Typography
        sx={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: 'rgba(125, 127, 130, 1)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          mb: 1.5
        }}
      >
        {formatMessage({ id: 'dash-quick-actions' })}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1
        }}
      >
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Box
              key={action.key}
              onClick={() => handleAction(action)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.75,
                p: 1.5,
                borderRadius: '8px',
                border: `1px solid ${theme.palette.divider}`,
                cursor: 'pointer',
                transition: `all 0.15s ${FIGMA_EASING}`,
                '&:hover': {
                  borderColor: alpha(action.color, 0.4),
                  backgroundColor: alpha(action.color, 0.04),
                  transform: 'translateY(-1px)',
                  boxShadow: `0 2px 8px ${alpha(action.color, 0.12)}`
                }
              }}
            >
              <Icon size={20} color={action.color} />
              <Typography
                sx={{
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: 'rgba(83, 86, 90, 1)',
                  textAlign: 'center',
                  lineHeight: 1.2
                }}
              >
                {formatMessage({ id: action.labelKey })}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default QuickActionsPanel;
