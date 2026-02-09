import { useState } from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { CategoryWeeklyData } from '../dashboard.types';
import { useIntl } from 'react-intl';

const FIGMA_EASING = 'cubic-bezier(0.46, 0.03, 0.52, 0.96)';
const FIGMA_SHADOW =
  '0px 16px 48px 0px rgba(17,24,39,0.04), 0px 12px 24px 0px rgba(17,24,39,0.04), 0px 6px 8px 0px rgba(17,24,39,0.02), 0px 2px 3px 0px rgba(17,24,39,0.02)';

const CATEGORY_COLORS: Record<string, string> = {
  기술: '#3B82F6',
  품질: '#f97316',
  사양: '#52c41a',
  기타: '#94a3b8'
};

type FilterKey = 'all' | '기술' | '품질' | '사양' | '기타';

const FILTER_OPTIONS: { key: FilterKey; labelKey: string }[] = [
  { key: 'all', labelKey: 'dash-filter-all' },
  { key: '기술', labelKey: 'dash-filter-tech' },
  { key: '품질', labelKey: 'dash-filter-quality' },
  { key: '사양', labelKey: 'dash-filter-spec' },
  { key: '기타', labelKey: 'dash-filter-etc' }
];

interface CategoryAnalysisChartProps {
  data: CategoryWeeklyData[];
  title: string;
  subtitle: string;
}

const CategoryAnalysisChart = ({ data, title, subtitle }: CategoryAnalysisChartProps) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  // Calculate max value for target line positioning
  const maxTotal = Math.max(...data.map((d) => d.기술 + d.품질 + d.사양 + d.기타), 1);
  const targetValue = Math.round(maxTotal * 0.85);

  const visibleCategories = activeFilter === 'all'
    ? ['기술', '품질', '사양', '기타']
    : [activeFilter];

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
      {/* Header with title + filter chips */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
        <Box>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'rgba(44, 45, 48, 1)'
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 400,
              color: 'rgba(125, 127, 130, 1)',
              mt: 0.25
            }}
          >
            {subtitle}
          </Typography>
        </Box>
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {FILTER_OPTIONS.map((opt) => (
            <Chip
              key={opt.key}
              label={formatMessage({ id: opt.labelKey })}
              size="small"
              variant={activeFilter === opt.key ? 'filled' : 'outlined'}
              onClick={() => setActiveFilter(opt.key)}
              sx={{
                fontSize: '0.625rem',
                fontWeight: 600,
                height: 26,
                borderRadius: '6px',
                transition: `all 0.15s ${FIGMA_EASING}`,
                ...(activeFilter === opt.key
                  ? {
                      backgroundColor: 'rgba(44, 45, 48, 1)',
                      color: '#fff',
                      border: '1px solid rgba(44, 45, 48, 1)',
                      '&:hover': { backgroundColor: 'rgba(64, 65, 68, 1)' }
                    }
                  : {
                      backgroundColor: 'transparent',
                      color: 'rgba(125, 127, 130, 1)',
                      borderColor: 'rgba(234, 234, 235, 1)',
                      '&:hover': { backgroundColor: 'rgba(250, 250, 250, 1)' }
                    })
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Chart */}
      <Box height={280}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(234, 234, 235, 1)" vertical={false} />
            <XAxis
              dataKey="day"
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
              cursor={{ fill: 'rgba(239, 246, 255, 0.3)' }}
            />
            <Legend
              verticalAlign="bottom"
              height={30}
              formatter={(value: string) => (
                <span style={{ color: 'rgba(83, 86, 90, 1)', fontSize: 11, fontWeight: 500 }}>
                  {value}
                </span>
              )}
            />
            {/* Target reference line */}
            <ReferenceLine
              y={targetValue}
              stroke="#3B82F6"
              strokeDasharray="6 4"
              strokeWidth={2}
              label={{
                value: `Target ${Math.round((targetValue / maxTotal) * 100)}%`,
                position: 'right',
                fill: '#3B82F6',
                fontSize: 11,
                fontWeight: 600
              }}
            />
            {visibleCategories.includes('기술') && (
              <Bar dataKey="기술" stackId="a" fill={CATEGORY_COLORS['기술']} maxBarSize={40} />
            )}
            {visibleCategories.includes('품질') && (
              <Bar dataKey="품질" stackId="a" fill={CATEGORY_COLORS['품질']} maxBarSize={40} />
            )}
            {visibleCategories.includes('사양') && (
              <Bar dataKey="사양" stackId="a" fill={CATEGORY_COLORS['사양']} maxBarSize={40} />
            )}
            {visibleCategories.includes('기타') && (
              <Bar
                dataKey="기타"
                stackId="a"
                fill={CATEGORY_COLORS['기타']}
                maxBarSize={40}
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default CategoryAnalysisChart;
