import { Box, Paper, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// Figma Design Tokens
const FIGMA_EASING = 'cubic-bezier(0.46, 0.03, 0.52, 0.96)';
const FIGMA_SHADOW =
  '0px 16px 48px 0px rgba(17,24,39,0.04), 0px 12px 24px 0px rgba(17,24,39,0.04), 0px 6px 8px 0px rgba(17,24,39,0.02), 0px 2px 3px 0px rgba(17,24,39,0.02)';

const colorTokens = {
  primary: { main: '#3B82F6', bg: 'rgba(239, 246, 255, 1)' },
  warning: { main: '#faad14', bg: '#fef9c3' },
  success: { main: '#52c41a', bg: '#dcfce7' },
  error: { main: '#E41B23', bg: '#ffe4e6' }
};

const badgeColors = {
  success: { bg: '#dcfce7', color: '#16a34a' },
  warning: { bg: '#fef9c3', color: '#a16207' },
  error: { bg: '#ffe4e6', color: '#dc2626' },
  info: { bg: 'rgba(239, 246, 255, 1)', color: '#3B82F6' }
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: 'primary' | 'warning' | 'success' | 'error';
  subtitle?: string;
  trend?: { value: number; direction: 'up' | 'down' };
  badge?: { label: string; type: 'success' | 'warning' | 'error' | 'info' };
  sparklineData?: number[];
  unit?: string;
}

const StatCard = ({ title, value, icon, color, subtitle, trend, badge, sparklineData, unit }: StatCardProps) => {
  const theme = useTheme();
  const tokens = colorTokens[color];
  const sparkData = sparklineData?.map((v) => ({ v })) || [];

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
        justifyContent: 'space-between',
        transition: `all 0.2s ${FIGMA_EASING}`,
        overflow: 'hidden',
        '&:hover': {
          boxShadow: FIGMA_SHADOW,
          borderColor: alpha(tokens.main, 0.3),
          transform: 'translateY(-1px)'
        }
      }}
    >
      {/* Top: icon + label + badge + sparkline */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: tokens.bg,
                color: tokens.main
              }}
            >
              {icon}
            </Box>
            <Typography
              sx={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: 'rgba(125, 127, 130, 1)',
                letterSpacing: '0.01em'
              }}
            >
              {title}
            </Typography>
            {badge && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.3,
                  px: 0.75,
                  py: 0.15,
                  borderRadius: '20px',
                  fontSize: '0.5625rem',
                  fontWeight: 700,
                  backgroundColor: badgeColors[badge.type].bg,
                  color: badgeColors[badge.type].color,
                  whiteSpace: 'nowrap',
                  ml: 'auto'
                }}
              >
                {badge.type === 'success' && '✓ '}
                {badge.type === 'error' && '▲ '}
                {badge.type === 'warning' && '⊘ '}
                {badge.label}
              </Box>
            )}
          </Box>
          <Box display="flex" alignItems="baseline" gap={0.5}>
            <Typography
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'rgba(44, 45, 48, 1)',
                lineHeight: 1.2
              }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            {unit && (
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'rgba(125, 127, 130, 1)'
                }}
              >
                {unit}
              </Typography>
            )}
          </Box>
        </Box>
        {sparkData.length > 0 && (
          <Box sx={{ width: 80, height: 40, opacity: 0.8, mt: 0.5 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                <defs>
                  <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={tokens.main} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={tokens.main} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={tokens.main}
                  fill={`url(#spark-${color})`}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>

      {/* Bottom: trend pill + subtitle */}
      <Box display="flex" alignItems="center" gap={1} mt={1.5}>
        {trend && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.3,
              px: 1,
              py: 0.25,
              borderRadius: '20px',
              fontSize: '0.625rem',
              fontWeight: 600,
              backgroundColor: trend.direction === 'up' ? '#ffe4e6' : '#dcfce7',
              color: trend.direction === 'up' ? '#dc2626' : '#16a34a'
            }}
          >
            {trend.direction === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend.value}
          </Box>
        )}
        {subtitle && (
          <Typography
            sx={{
              fontSize: '0.625rem',
              fontWeight: 500,
              color: 'rgba(166, 167, 171, 1)'
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default StatCard;
