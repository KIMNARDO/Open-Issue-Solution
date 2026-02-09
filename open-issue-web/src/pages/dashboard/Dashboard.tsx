import { useState, useMemo, useCallback } from 'react';
import { Box, Grid, Typography, CircularProgress, Chip } from '@mui/material';
import { ListChecks, AlertTriangle, Clock, RefreshCw, Activity } from 'lucide-react';
import BasicLayout from 'layout/Basic';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';

import StatCard from './components/StatCard';
import CategoryAnalysisChart from './components/CategoryAnalysisChart';
import QuickActionsPanel from './components/QuickActionsPanel';
import RecentActivityFeed from './components/RecentActivityFeed';
import IssuePipelineGrid from './components/IssuePipelineGrid';
import { useDashboardData } from './hooks/useDashboardData';

const FIGMA_EASING = 'cubic-bezier(0.46, 0.03, 0.52, 0.96)';

const Dashboard = () => {
  const { formatMessage } = useIntl();
  const {
    isLoading,
    stats,
    completionRate,
    monthlyTrendData,
    categoryWeeklyData,
    pipelineIssues,
    recentActivities
  } = useDashboardData();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sparkline data derived from monthly trend
  const sparklines = useMemo(
    () => ({
      total: monthlyTrendData.map((d) => d.created + d.closed),
      open: monthlyTrendData.map((d) => d.created),
      closed: monthlyTrendData.map((d) => d.closed),
      delayed: monthlyTrendData.map((d) => Math.max(0, d.created - d.closed))
    }),
    [monthlyTrendData]
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <BasicLayout>
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>

        {/* ===== 1. Sub-Header ===== */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography
              sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'rgba(44, 45, 48, 1)' }}
            >
              {formatMessage({ id: 'dash-title' })}
            </Typography>
            <Typography
              sx={{ fontSize: '0.6875rem', fontWeight: 500, color: 'rgba(125, 127, 130, 1)', mt: 0.5 }}
            >
              {formatMessage({ id: 'dash-subtitle' })}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            {/* Updated button */}
            <Chip
              icon={
                <RefreshCw
                  size={12}
                  style={{
                    transition: `transform 0.6s ${FIGMA_EASING}`,
                    transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)'
                  }}
                />
              }
              label={formatMessage({ id: 'dash-updated-ago' })}
              size="small"
              onClick={handleRefresh}
              sx={{
                fontSize: '0.625rem',
                fontWeight: 500,
                backgroundColor: 'transparent',
                border: '1px solid rgba(234, 234, 235, 1)',
                color: 'rgba(125, 127, 130, 1)',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(250, 250, 250, 1)' },
                '& .MuiChip-icon': { color: 'rgba(125, 127, 130, 1)' }
              }}
            />
            {/* Date chip */}
            <Chip
              label={dayjs().format('YYYY.MM.DD')}
              size="small"
              sx={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                backgroundColor: 'rgba(239, 246, 255, 1)',
                color: '#3B82F6',
                border: '1px solid rgba(191, 219, 254, 1)'
              }}
            />
          </Box>
        </Box>

        {/* ===== 2. KPI Cards ===== */}
        <Grid container spacing={2} mb={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={formatMessage({ id: 'dash-total-issues' })}
              value={stats.total}
              icon={<ListChecks size={20} />}
              color="primary"
              badge={{ label: `+${stats.total}`, type: 'info' }}
              subtitle={formatMessage({ id: 'dash-all-types' })}
              sparklineData={sparklines.total}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={formatMessage({ id: 'dash-resolution-rate' })}
              value={completionRate}
              unit="%"
              icon={<Activity size={20} />}
              color="success"
              badge={
                completionRate >= 80
                  ? { label: formatMessage({ id: 'dash-on-target' }), type: 'success' }
                  : { label: `${completionRate}%`, type: 'warning' }
              }
              subtitle={formatMessage({ id: 'dash-completed' })}
              sparklineData={sparklines.closed}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={formatMessage({ id: 'dash-delayed-issues' })}
              value={stats.delayed}
              icon={<AlertTriangle size={20} />}
              color="error"
              badge={stats.delayed > 0 ? { label: `+${stats.delayed}`, type: 'error' } : undefined}
              trend={stats.delayed > 0 ? { value: stats.delayed, direction: 'up' } : undefined}
              subtitle={formatMessage({ id: 'dash-needs-attention' })}
              sparklineData={sparklines.delayed}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={formatMessage({ id: 'dash-pending-issues' })}
              value={stats.pending}
              icon={<Clock size={20} />}
              color="warning"
              badge={{ label: formatMessage({ id: 'dash-pending' }), type: 'warning' }}
              subtitle={formatMessage({ id: 'dash-in-progress' })}
              sparklineData={sparklines.open}
            />
          </Grid>
        </Grid>

        {/* ===== 3. Main Content + Right Sidebar ===== */}
        <Box display="flex" gap={2.5} mb={2.5}>
          {/* Left: Main Content ~70% */}
          <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
            {/* Category Analysis Chart */}
            <Box mb={2.5}>
              <CategoryAnalysisChart
                data={categoryWeeklyData}
                title={formatMessage({ id: 'dash-category-analysis' })}
                subtitle={formatMessage({ id: 'dash-category-breakdown' })}
              />
            </Box>

            {/* Issue Pipeline Grid */}
            <IssuePipelineGrid data={pipelineIssues} />
          </Box>

          {/* Right Sidebar ~280px */}
          <Box
            sx={{
              flex: '0 0 280px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5
            }}
          >
            <QuickActionsPanel />
            <RecentActivityFeed activities={recentActivities} />
          </Box>
        </Box>

      </Box>
    </BasicLayout>
  );
};

export default Dashboard;
