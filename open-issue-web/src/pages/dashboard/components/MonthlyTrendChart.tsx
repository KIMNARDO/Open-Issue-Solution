import { Paper, Typography, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonthlyTrendData } from '../dashboard.types';
import { useIntl } from 'react-intl';

const FIGMA_EASING = 'cubic-bezier(0.46, 0.03, 0.52, 0.96)';
const FIGMA_SHADOW =
  '0px 16px 48px 0px rgba(17,24,39,0.04), 0px 12px 24px 0px rgba(17,24,39,0.04), 0px 6px 8px 0px rgba(17,24,39,0.02), 0px 2px 3px 0px rgba(17,24,39,0.02)';

interface MonthlyTrendChartProps {
  data: MonthlyTrendData[];
  title: string;
}

const MonthlyTrendChart = ({ data, title }: MonthlyTrendChartProps) => {
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
        transition: `all 0.2s ${FIGMA_EASING}`,
        '&:hover': {
          boxShadow: FIGMA_SHADOW,
          borderColor: alpha(theme.palette.primary.main, 0.15)
        }
      }}
    >
      <Typography
        sx={{
          fontSize: '0.875rem',
          fontWeight: 700,
          color: 'rgba(44, 45, 48, 1)',
          mb: 1
        }}
      >
        {title}
      </Typography>
      <Box height={250}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="trendCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="trendClosed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#52c41a" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(234, 234, 235, 1)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'rgba(125, 127, 130, 1)' }}
              axisLine={{ stroke: 'rgba(234, 234, 235, 1)' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: 'rgba(125, 127, 130, 1)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={((value: number, name: string) => [`${value}건`, name]) as any}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
                fontSize: 12,
                padding: '8px 12px'
              }}
            />
            <Legend
              verticalAlign="top"
              height={30}
              formatter={(value: string) => (
                <span style={{ color: 'rgba(83, 86, 90, 1)', fontSize: 11, fontWeight: 500 }}>{value}</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="created"
              name={formatMessage({ id: 'dash-created' })}
              stroke="#3B82F6"
              fill="url(#trendCreated)"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3B82F6', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="closed"
              name={formatMessage({ id: 'issue-state-closed' })}
              stroke="#52c41a"
              fill="url(#trendClosed)"
              strokeWidth={2}
              dot={{ r: 3, fill: '#52c41a', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#52c41a', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default MonthlyTrendChart;
