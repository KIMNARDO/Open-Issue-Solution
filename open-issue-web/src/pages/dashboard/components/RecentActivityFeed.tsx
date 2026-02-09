import { Paper, Typography, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { DashboardActivity } from '../dashboard.types';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import useConfig from 'hooks/useConfig';

dayjs.extend(relativeTime);

const FIGMA_EASING = 'cubic-bezier(0.46, 0.03, 0.52, 0.96)';
const FIGMA_SHADOW =
  '0px 16px 48px 0px rgba(17,24,39,0.04), 0px 12px 24px 0px rgba(17,24,39,0.04), 0px 6px 8px 0px rgba(17,24,39,0.02), 0px 2px 3px 0px rgba(17,24,39,0.02)';

const ACTION_LABELS: Record<string, { ko: string; en: string }> = {
  STATUS_CHANGED: { ko: '상태 변경', en: 'Status changed' },
  CREATED: { ko: '이슈 등록', en: 'Issue created' },
  COMMENT_ADDED: { ko: '코멘트 추가', en: 'Comment added' },
  PRIORITY_CHANGED: { ko: '중요도 변경', en: 'Priority changed' },
  MANAGER_ASSIGNED: { ko: '담당자 배정', en: 'Manager assigned' }
};

interface RecentActivityFeedProps {
  activities: DashboardActivity[];
}

const RecentActivityFeed = ({ activities }: RecentActivityFeedProps) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const { i18n } = useConfig();
  const lang = i18n === 'ko' ? 'ko' : 'en';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '12px',
        border: `1px solid ${theme.palette.divider}`,
        transition: `all 0.2s ${FIGMA_EASING}`,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
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
        {formatMessage({ id: 'dash-recent-activity' })}
      </Typography>

      <Box sx={{ flex: 1, overflow: 'auto', position: 'relative', pl: 2 }}>
        {/* Vertical line */}
        <Box
          sx={{
            position: 'absolute',
            left: 5,
            top: 6,
            bottom: 6,
            width: 1.5,
            backgroundColor: theme.palette.divider
          }}
        />

        {activities.length === 0 ? (
          <Typography
            sx={{ fontSize: '0.6875rem', color: 'rgba(166, 167, 171, 1)', textAlign: 'center', py: 2 }}
          >
            {lang === 'ko' ? '최근 활동이 없습니다.' : 'No recent activity.'}
          </Typography>
        ) : (
          activities.map((activity, idx) => (
            <Box
              key={activity.id + '-' + idx}
              sx={{
                position: 'relative',
                pb: 1.5,
                pl: 1.5,
                '&:last-child': { pb: 0 }
              }}
            >
              {/* Dot */}
              <Box
                sx={{
                  position: 'absolute',
                  left: -7.5,
                  top: 5,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: activity.color,
                  border: '2px solid #fff',
                  boxShadow: `0 0 0 1px ${theme.palette.divider}`
                }}
              />

              <Typography
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'rgba(44, 45, 48, 1)',
                  lineHeight: 1.3
                }}
              >
                {ACTION_LABELS[activity.action]?.[lang] || activity.action}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.5625rem',
                  fontWeight: 400,
                  color: 'rgba(125, 127, 130, 1)',
                  lineHeight: 1.3,
                  mt: 0.15
                }}
                noWrap
              >
                {activity.issueNo} · {activity.description}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  color: 'rgba(166, 167, 171, 1)',
                  mt: 0.15
                }}
              >
                {dayjs(activity.timestamp).locale(lang).fromNow()}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default RecentActivityFeed;
