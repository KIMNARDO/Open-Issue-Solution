import { useRef, useMemo } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz } from 'ag-grid-community';
import { ColDef } from 'ag-grid-community';
import { PipelineIssueItem } from '../dashboard.types';
import { ImportanceRenderer } from 'components/cellEditor/ImportanceRenderer';
import { IssueStatusRenderer } from 'components/cellEditor/IssueStatusRenderer';
import { useIntl } from 'react-intl';
import useConfig from 'hooks/useConfig';
import { AG_GRID_LOCALE_KR, AG_GRID_LOCALE_EN } from '@ag-grid-community/locale';

const FIGMA_EASING = 'cubic-bezier(0.46, 0.03, 0.52, 0.96)';
const FIGMA_SHADOW =
  '0px 16px 48px 0px rgba(17,24,39,0.04), 0px 12px 24px 0px rgba(17,24,39,0.04), 0px 6px 8px 0px rgba(17,24,39,0.02), 0px 2px 3px 0px rgba(17,24,39,0.02)';

interface IssuePipelineGridProps {
  data: PipelineIssueItem[];
}

const IssuePipelineGrid = ({ data }: IssuePipelineGridProps) => {
  const theme = useTheme();
  const gridRef = useRef<AgGridReact>(null);
  const { formatMessage } = useIntl();
  const { i18n } = useConfig();

  const statusBreakdown = useMemo(() => {
    const open = data.filter((d) => d.issueState === '78102').length;
    const pending = data.filter((d) => d.issueState === '78104').length;
    const closed = data.filter((d) => d.issueState === '78106').length;
    const delayed = data.filter((d) => d.delay > 0).length;
    const critical = data.filter((d) => d.importance === '5' || d.delay > 7).length;
    return { open, pending, closed, delayed, critical, total: data.length };
  }, [data]);

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: 'ID',
      field: 'issueNo',
      width: 130,
      minWidth: 110,
      cellStyle: { fontWeight: 600, fontSize: '0.75rem' }
    },
    {
      headerName: formatMessage({ id: 'col-description' }),
      field: 'contents',
      flex: 1,
      minWidth: 180,
      cellStyle: { fontSize: '0.75rem' },
      tooltipField: 'contents'
    },
    {
      headerName: formatMessage({ id: 'column-category' }),
      field: 'category',
      width: 80,
      minWidth: 70,
      cellStyle: { fontSize: '0.75rem' }
    },
    {
      headerName: formatMessage({ id: 'column-importance' }),
      field: 'importance',
      width: 90,
      minWidth: 80,
      cellRenderer: ImportanceRenderer,
      cellStyle: { display: 'flex', justifyContent: 'center' }
    },
    {
      headerName: formatMessage({ id: 'column-state' }),
      field: 'issueState',
      width: 90,
      minWidth: 80,
      cellRenderer: IssueStatusRenderer,
      cellStyle: { display: 'flex', justifyContent: 'center' }
    },
    {
      headerName: formatMessage({ id: 'column-manager-team' }),
      field: 'managerTeam',
      width: 100,
      minWidth: 80,
      cellStyle: { fontSize: '0.75rem' }
    },
    {
      headerName: formatMessage({ id: 'col-start-date' }),
      field: 'strDt',
      width: 100,
      minWidth: 90,
      cellStyle: { fontSize: '0.75rem', color: 'rgba(125, 127, 130, 1)' }
    },
    {
      headerName: formatMessage({ id: 'col-end-date' }),
      field: 'finDt',
      width: 100,
      minWidth: 90,
      cellStyle: { fontSize: '0.75rem', color: 'rgba(125, 127, 130, 1)' }
    },
    {
      headerName: formatMessage({ id: 'col-delay' }),
      field: 'delay',
      width: 70,
      minWidth: 60,
      cellStyle: (params) => ({
        fontSize: '0.75rem',
        fontWeight: 600,
        color: params.value > 7 ? '#E41B23' : params.value > 0 ? '#f97316' : 'rgba(125, 127, 130, 1)',
        display: 'flex',
        justifyContent: 'center'
      }),
      valueFormatter: (params) => params.value > 0 ? `${params.value}d` : '-'
    }
  ], [formatMessage]);

  const agTheme = themeQuartz.withParams({
    backgroundColor: '#ffffff',
    headerBackgroundColor: 'rgba(250, 250, 250, 1)',
    headerTextColor: 'rgba(83, 86, 90, 1)',
    headerFontSize: 12,
    headerFontWeight: 600,
    rowHoverColor: 'rgba(239, 246, 255, 0.5)',
    borderColor: 'rgba(234, 234, 235, 1)',
    fontSize: 12,
    cellTextColor: 'rgba(83, 86, 90, 1)'
  });

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '12px',
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        transition: `all 0.2s ${FIGMA_EASING}`,
        '&:hover': {
          boxShadow: FIGMA_SHADOW,
          borderColor: alpha(theme.palette.primary.main, 0.15)
        }
      }}
    >
      {/* Summary Bar */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'rgba(250, 250, 250, 1)'
        }}
      >
        {/* Top row: title + metrics */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ width: 3, height: 14, borderRadius: 2, backgroundColor: '#3B82F6' }} />
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(44, 45, 48, 1)' }}>
              {formatMessage({ id: 'dash-active-pipeline' })}
            </Typography>
            <Box
              sx={{
                px: 0.75,
                py: 0.15,
                borderRadius: '4px',
                backgroundColor: 'rgba(239, 246, 255, 1)',
                border: '1px solid rgba(191, 219, 254, 1)'
              }}
            >
              <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, color: '#3B82F6', lineHeight: 1.4 }}>
                {statusBreakdown.total}{formatMessage({ id: 'dash-items' })}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            {[
              { label: formatMessage({ id: 'dash-open' }), value: statusBreakdown.open, color: '#3B82F6' },
              { label: formatMessage({ id: 'issue-state-pending' }), value: statusBreakdown.pending, color: '#f97316' },
              { label: formatMessage({ id: 'dash-closed' }), value: statusBreakdown.closed, color: '#52c41a' },
              { label: formatMessage({ id: 'dash-delayed' }), value: statusBreakdown.delayed, color: '#E41B23' }
            ].map((item) => (
              <Box key={item.label} display="flex" alignItems="center" gap={0.5}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: item.color }} />
                <Typography sx={{ fontSize: '0.625rem', fontWeight: 500, color: 'rgba(125, 127, 130, 1)' }}>
                  {item.label}
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: item.color }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
            {statusBreakdown.critical > 0 && (
              <Box
                sx={{
                  px: 0.75,
                  py: 0.15,
                  borderRadius: '4px',
                  backgroundColor: alpha('#E41B23', 0.08),
                  border: `1px solid ${alpha('#E41B23', 0.2)}`
                }}
              >
                <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, color: '#E41B23', lineHeight: 1.4 }}>
                  {statusBreakdown.critical} {formatMessage({ id: 'dash-critical-issues' })}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        {/* Progress bar */}
        {statusBreakdown.total > 0 && (
          <Box display="flex" height={4} borderRadius={2} overflow="hidden" gap="1px">
            {statusBreakdown.open > 0 && (
              <Box sx={{ flex: statusBreakdown.open, backgroundColor: '#3B82F6', borderRadius: '2px 0 0 2px' }} />
            )}
            {statusBreakdown.pending > 0 && (
              <Box sx={{ flex: statusBreakdown.pending, backgroundColor: '#f97316' }} />
            )}
            {statusBreakdown.closed > 0 && (
              <Box sx={{ flex: statusBreakdown.closed, backgroundColor: '#52c41a' }} />
            )}
            {(statusBreakdown.total - statusBreakdown.open - statusBreakdown.pending - statusBreakdown.closed) > 0 && (
              <Box sx={{ flex: statusBreakdown.total - statusBreakdown.open - statusBreakdown.pending - statusBreakdown.closed, backgroundColor: 'rgba(234, 234, 235, 1)', borderRadius: '0 2px 2px 0' }} />
            )}
          </Box>
        )}
      </Box>

      {/* AG Grid */}
      <Box sx={{ height: 350 }}>
        <AgGridReact
          ref={gridRef}
          theme={agTheme}
          rowData={data}
          columnDefs={columnDefs}
          rowHeight={36}
          headerHeight={34}
          localeText={i18n === 'ko' ? AG_GRID_LOCALE_KR : AG_GRID_LOCALE_EN}
          getRowId={(params) => String(params.data.oid)}
          animateRows={false}
          suppressCellFocus
          tooltipShowDelay={300}
        />
      </Box>
    </Paper>
  );
};

export default IssuePipelineGrid;
