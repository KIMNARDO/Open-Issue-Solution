import { Paper, Typography, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { StatusChartData } from '../dashboard.types';

const FIGMA_EASING = 'cubic-bezier(0.46, 0.03, 0.52, 0.96)';
const FIGMA_SHADOW =
  '0px 16px 48px 0px rgba(17,24,39,0.04), 0px 12px 24px 0px rgba(17,24,39,0.04), 0px 6px 8px 0px rgba(17,24,39,0.02), 0px 2px 3px 0px rgba(17,24,39,0.02)';

interface StatusPieChartProps {
  data: StatusChartData[];
  title: string;
}

const StatusPieChart = ({ data, title }: StatusPieChartProps) => {
  const theme = useTheme();
  const total = data.reduce((sum, d) => sum + d.value, 0);

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
      <Box height={250} position="relative">
        {/* Center label */}
        <Box
          sx={{
            position: 'absolute',
            top: '43%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'rgba(44, 45, 48, 1)',
              lineHeight: 1.2
            }}
          >
            {total}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.5rem',
              fontWeight: 600,
              color: 'rgba(166, 167, 171, 1)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            TOTAL
          </Typography>
        </Box>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={
                ((value: number, name: string) => [
                  `${value}건 (${total > 0 ? Math.round((value / total) * 100) : 0}%)`,
                  name
                ]) as any
              }
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
                fontSize: 12,
                padding: '8px 12px'
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string, entry: any) => (
                <span style={{ color: 'rgba(83, 86, 90, 1)', fontSize: 11, fontWeight: 500 }}>
                  {value} ({entry.payload.value})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default StatusPieChart;
