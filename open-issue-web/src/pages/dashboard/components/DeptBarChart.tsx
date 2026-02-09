import { Paper, Typography, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DeptChartData } from '../dashboard.types';
import { useIntl } from 'react-intl';

const FIGMA_EASING = 'cubic-bezier(0.46, 0.03, 0.52, 0.96)';
const FIGMA_SHADOW =
  '0px 16px 48px 0px rgba(17,24,39,0.04), 0px 12px 24px 0px rgba(17,24,39,0.04), 0px 6px 8px 0px rgba(17,24,39,0.02), 0px 2px 3px 0px rgba(17,24,39,0.02)';

interface DeptBarChartProps {
  data: DeptChartData[];
  title: string;
}

const DeptBarChart = ({ data, title }: DeptBarChartProps) => {
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
          <BarChart data={translatedData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(234, 234, 235, 1)" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fontSize: 11, fill: 'rgba(125, 127, 130, 1)' }}
              axisLine={{ stroke: 'rgba(234, 234, 235, 1)' }}
              tickLine={false}
            />
            <YAxis
              dataKey="displayName"
              type="category"
              tick={{ fontSize: 11, fill: 'rgba(83, 86, 90, 1)', fontWeight: 500 }}
              width={55}
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
              cursor={{ fill: 'rgba(239, 246, 255, 0.3)' }}
            />
            <Legend
              verticalAlign="top"
              height={30}
              formatter={(value: string) => (
                <span style={{ color: 'rgba(83, 86, 90, 1)', fontSize: 11, fontWeight: 500 }}>{value}</span>
              )}
            />
            <Bar dataKey="open" name={formatMessage({ id: 'issue-state-open' })} fill="#3B82F6" stackId="a" maxBarSize={18} />
            <Bar dataKey="delayed" name={formatMessage({ id: 'filter-delayed' })} fill="#E41B23" stackId="a" maxBarSize={18} />
            <Bar
              dataKey="closed"
              name={formatMessage({ id: 'issue-state-closed' })}
              fill="#52c41a"
              stackId="a"
              radius={[0, 4, 4, 0]}
              maxBarSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default DeptBarChart;
