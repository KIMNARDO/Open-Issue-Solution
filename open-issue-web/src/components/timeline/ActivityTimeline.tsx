import { Box, Chip, Typography, useTheme } from '@mui/material';
import { ActivityLog, ACTION_LABELS } from 'api/qms/open-issue/activityLog.types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import useConfig from 'hooks/useConfig';

dayjs.extend(relativeTime);

const actionColors: Record<string, string> = {
  CREATED: '#1976d2',
  STATUS_CHANGED: '#f57c00',
  COMMENT_ADDED: '#388e3c',
  FILE_UPLOADED: '#7b1fa2',
  MANAGER_ASSIGNED: '#00838f',
  PRIORITY_CHANGED: '#c62828',
  DATE_CHANGED: '#455a64'
};

interface ActivityTimelineProps {
  logs: ActivityLog[];
}

const ActivityTimeline = ({ logs }: ActivityTimelineProps) => {
  const theme = useTheme();
  const { i18n } = useConfig();
  const lang = i18n === 'ko' ? 'ko' : 'en';

  if (logs.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <Typography variant="body2" color="text.secondary">
          {lang === 'ko' ? '활동 이력이 없습니다.' : 'No activity logs.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', pl: 3 }}>
      {/* 세로선 */}
      <Box
        sx={{
          position: 'absolute',
          left: 10,
          top: 8,
          bottom: 8,
          width: 2,
          backgroundColor: theme.palette.divider
        }}
      />

      {logs.map((log, idx) => {
        const color = actionColors[log.action] || '#757575';
        const actionLabel = ACTION_LABELS[log.action];
        const label = lang === 'ko' ? actionLabel?.ko : actionLabel?.en;
        const icon = actionLabel?.icon || '📝';

        return (
          <Box key={log.id} sx={{ position: 'relative', mb: 2.5, minHeight: 40 }}>
            {/* 타임라인 도트 */}
            <Box
              sx={{
                position: 'absolute',
                left: -25,
                top: 4,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: color,
                border: `2px solid ${theme.palette.background.paper}`,
                boxShadow: `0 0 0 2px ${color}33`,
                zIndex: 1
              }}
            />

            {/* 콘텐츠 */}
            <Box>
              <Box display="flex" alignItems="center" gap={0.8} mb={0.3}>
                <Typography variant="caption" fontSize={13}>
                  {icon}
                </Typography>
                <Chip
                  label={label}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    backgroundColor: `${color}18`,
                    color
                  }}
                />
                <Typography variant="caption" color="text.secondary" fontSize={11}>
                  {dayjs(log.timestamp).locale(lang).fromNow()}
                </Typography>
              </Box>

              <Typography variant="body2" fontSize={12.5} lineHeight={1.5} color="text.primary">
                {log.description}
              </Typography>

              {(log.oldValue || log.newValue) && (
                <Box display="flex" alignItems="center" gap={0.5} mt={0.3}>
                  {log.oldValue && (
                    <Typography
                      variant="caption"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'text.disabled',
                        fontSize: 11
                      }}
                    >
                      {log.oldValue}
                    </Typography>
                  )}
                  {log.oldValue && log.newValue && (
                    <Typography variant="caption" color="text.disabled" fontSize={11}>
                      →
                    </Typography>
                  )}
                  {log.newValue && (
                    <Typography variant="caption" fontWeight={600} color={color} fontSize={11}>
                      {log.newValue}
                    </Typography>
                  )}
                </Box>
              )}

              <Typography variant="caption" color="text.disabled" fontSize={10.5} mt={0.3} display="block">
                {log.userName} · {dayjs(log.timestamp).format('YYYY-MM-DD HH:mm')}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default ActivityTimeline;
