import { Paper, Typography, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PriorityChartData } from '../dashboard.types';
import { useIntl } from 'react-intl';

const FIGMA_EASING = 'cubic-bezier(0.46, 0.03, 0.52, 0.96)';
const FIGMA_SHADOW =
  '0px 16px 48px 0px rgba(17,24,39,0.04), 0px 12px 24px 0px rgba(17,24,39,0.04), 0px 6px 8px 0px rgba(17,24,39,0.02), 0px 2px 3px 0px rgba(17,24,39,0.02)';

interface PriorityBarChartProps {
  data: PriorityChartData[];
  title: string;
}

const PriorityBarChart = ({ data, title }: PriorityBarChartProps) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const translatedData = data.map((d) => ({
    ...d,
    displayName: d.nameKey ? formatMessage({ id: d.nameKey }) : d.name
  }));

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
          <BarChart data={translatedData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(234, 234, 235, 1)" vertical={false} />
            <XAxis
              dataKey="displayName"
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
              formatter={((value: number) => [`${value}건`]) as any}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
                fontSize: 12,
                padding: '8px 12px'
              }}
              cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={36}>
              {translatedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default PriorityBarChart;
