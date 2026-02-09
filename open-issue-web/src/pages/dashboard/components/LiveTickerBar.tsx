import { useRef, useEffect, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useIntl } from 'react-intl';
import { AlertTriangle, MessageCircle, Cpu, Clock, CheckCircle, Radio } from 'lucide-react';
import { TickerItem } from '../dashboard.types';

const TICKER_CONFIG: Record<
  TickerItem['type'],
  { icon: typeof AlertTriangle; color: string; bgColor: string; labelKey: string }
> = {
  urgent: { icon: AlertTriangle, color: '#E41B23', bgColor: '#ffe4e6', labelKey: 'ticker-urgent' },
  discussing: { icon: MessageCircle, color: '#8b5cf6', bgColor: '#f3e8ff', labelKey: 'ticker-discussing' },
  'dev-critical': { icon: Cpu, color: '#f97316', bgColor: '#fff7ed', labelKey: 'ticker-dev-critical' },
  delayed: { icon: Clock, color: '#faad14', bgColor: '#fef9c3', labelKey: 'ticker-delayed' },
  resolved: { icon: CheckCircle, color: '#52c41a', bgColor: '#dcfce7', labelKey: 'ticker-resolved' }
};

interface LiveTickerBarProps {
  items: TickerItem[];
}

const LiveTickerBar = ({ items }: LiveTickerBarProps) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // CSS animation 기반 연속 스크롤
  const animationDuration = Math.max(items.length * 6, 30); // 아이템 수에 비례

  if (items.length === 0) return null;

  return (
    <Box
      sx={{
        borderRadius: '12px',
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        mb: 2.5,
        backgroundColor: 'rgba(250, 250, 251, 1)'
      }}
    >
      {/* Header strip */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{
          px: 2,
          py: 0.75,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: '#fff'
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#E41B23',
            animation: 'tickerPulse 1.5s ease-in-out infinite'
          }}
        />
        <Radio size={14} color="#E41B23" />
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(44, 45, 48, 1)' }}>
          {formatMessage({ id: 'ticker-title' })}
        </Typography>
        <Typography sx={{ fontSize: '0.5625rem', color: 'rgba(125, 127, 130, 1)', ml: 'auto' }}>
          {items.length} {formatMessage({ id: 'ticker-active-items' })}
        </Typography>
      </Box>

      {/* Scrolling ticker */}
      <Box
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        sx={{
          overflow: 'hidden',
          position: 'relative',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          // 좌우 그라데이션 페이드
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: 40,
            zIndex: 1,
            pointerEvents: 'none'
          },
          '&::before': {
            left: 0,
            background: 'linear-gradient(to right, rgba(250,250,251,1), transparent)'
          },
          '&::after': {
            right: 0,
            background: 'linear-gradient(to left, rgba(250,250,251,1), transparent)'
          }
        }}
      >
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            gap: 3,
            whiteSpace: 'nowrap',
            animation: `tickerScroll ${animationDuration}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
            '&:hover': { animationPlayState: 'paused' }
          }}
        >
          {/* 2번 반복하여 끊김 없는 루프 */}
          {[...items, ...items].map((item, idx) => {
            const config = TICKER_CONFIG[item.type];
            const Icon = config.icon;
            return (
              <Box
                key={`${item.id}-${idx}`}
                display="flex"
                alignItems="center"
                gap={0.75}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '8px',
                  backgroundColor: alpha(config.color, 0.04),
                  border: `1px solid ${alpha(config.color, 0.15)}`,
                  cursor: 'default',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(config.color, 0.08),
                    transform: 'scale(1.02)'
                  }
                }}
              >
                {/* Type badge */}
                <Chip
                  icon={<Icon size={10} />}
                  label={formatMessage({ id: config.labelKey })}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.5625rem',
                    fontWeight: 700,
                    backgroundColor: config.bgColor,
                    color: config.color,
                    '& .MuiChip-icon': { color: config.color, ml: '4px' },
                    '& .MuiChip-label': { px: 0.5 }
                  }}
                />
                {/* Issue number */}
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: config.color
                  }}
                >
                  {item.issueNo}
                </Typography>
                {/* Message */}
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    color: 'rgba(44, 45, 48, 1)',
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.message}
                </Typography>
                {/* Plant */}
                {item.plant && (
                  <Typography
                    sx={{
                      fontSize: '0.5625rem',
                      fontWeight: 500,
                      color: 'rgba(125, 127, 130, 1)',
                      backgroundColor: 'rgba(240, 240, 241, 1)',
                      px: 0.5,
                      py: 0.1,
                      borderRadius: '4px'
                    }}
                  >
                    {item.plant}
                  </Typography>
                )}
                {/* Team */}
                <Typography
                  sx={{
                    fontSize: '0.5625rem',
                    color: 'rgba(125, 127, 130, 1)'
                  }}
                >
                  {item.team}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* CSS Animations */}
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes tickerPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </Box>
  );
};

export default LiveTickerBar;
