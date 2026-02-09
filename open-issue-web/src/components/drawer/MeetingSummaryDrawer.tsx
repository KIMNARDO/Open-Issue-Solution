import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  Chip,
  Stack,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  useTheme
} from '@mui/material';
import { Copy, Printer, X, ChevronDown, ChevronUp } from 'lucide-react';
import { OpenIssueType } from 'pages/qms/qms/open-issue';
import { calculateDelay } from 'pages/qms/qms/open-issue/util';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { commonNotification } from 'api/common/notification';

export interface MeetingSummaryDrawerRef {
  open: () => void;
  close: () => void;
}

interface MeetingSummaryDrawerProps {
  issues: OpenIssueType[];
  groupName?: string;
  width?: number;
}

type DateRange = '7d' | '30d' | 'all';

const OPEN_STATES = ['78102', '진행', '진행중', '검토중'];
const CLOSED_STATES = ['78106', '완료'];

const MeetingSummaryDrawer = forwardRef<MeetingSummaryDrawerRef, MeetingSummaryDrawerProps>(
  ({ issues, groupName, width = 520 }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange>('all');
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
    const theme = useTheme();
    const { formatMessage } = useIntl();

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false)
    }));

    const toggleSection = (key: string) => {
      setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // 날짜 범위 필터링
    const filteredIssues = useMemo(() => {
      if (dateRange === 'all') return issues;
      const days = dateRange === '7d' ? 7 : 30;
      const cutoff = dayjs().subtract(days, 'day');
      return issues.filter((i) => dayjs(i.strDt).isAfter(cutoff));
    }, [issues, dateRange]);

    // 분류
    const summary = useMemo(() => {
      const openIssues = filteredIssues.filter(
        (i) => OPEN_STATES.includes(i.issueState || '') || OPEN_STATES.includes(i.issueStateNm || '')
      );
      const closedIssues = filteredIssues.filter(
        (i) => CLOSED_STATES.includes(i.issueState || '') || CLOSED_STATES.includes(i.issueStateNm || '')
      );
      const delayedIssues = filteredIssues
        .filter((i) => {
          if (CLOSED_STATES.includes(i.issueState || '') || CLOSED_STATES.includes(i.issueStateNm || '')) return false;
          const delay = calculateDelay(i);
          return delay !== null && delay > 0;
        })
        .sort((a, b) => (calculateDelay(b) || 0) - (calculateDelay(a) || 0));

      const urgentIssues = filteredIssues.filter((i) => i.importance === '5' || i.importance === '4');
      const recentClosed = closedIssues
        .filter((i) => i.closeDt && dayjs(i.closeDt).isAfter(dayjs().subtract(7, 'day')))
        .sort((a, b) => dayjs(b.closeDt).unix() - dayjs(a.closeDt).unix());

      return {
        total: filteredIssues.length,
        open: openIssues.length,
        closed: closedIssues.length,
        pending: filteredIssues.length - openIssues.length - closedIssues.length,
        delayed: delayedIssues,
        urgent: urgentIssues,
        recentClosed,
        openIssues
      };
    }, [filteredIssues]);

    // 텍스트 요약 생성
    const summaryText = useMemo(() => {
      const today = dayjs().format('YYYY-MM-DD');
      const lines: string[] = [];

      lines.push(`[${groupName || 'Open Issue'}] ${formatMessage({ id: 'meeting-summary-title' })} (${today} ${formatMessage({ id: 'meeting-basis' })})`);
      lines.push('━'.repeat(40));
      lines.push('');

      // 현황 요약
      lines.push(`${formatMessage({ id: 'meeting-status-summary' })}`);
      lines.push(`  - ${formatMessage({ id: 'dash-total-issues' })}: ${summary.total}${formatMessage({ id: 'meeting-count' })} | ${formatMessage({ id: 'meeting-open' })}: ${summary.open}${formatMessage({ id: 'meeting-count' })} | ${formatMessage({ id: 'meeting-pending' })}: ${summary.pending}${formatMessage({ id: 'meeting-count' })} | ${formatMessage({ id: 'meeting-closed' })}: ${summary.closed}${formatMessage({ id: 'meeting-count' })}`);
      lines.push('');

      // 긴급/지연 이슈
      if (summary.delayed.length > 0 || summary.urgent.length > 0) {
        lines.push(`${formatMessage({ id: 'meeting-urgent-delayed' })}`);
        const urgentDelayed = [...new Set([...summary.delayed, ...summary.urgent])];
        urgentDelayed.slice(0, 8).forEach((issue, idx) => {
          const delay = calculateDelay(issue);
          const delayText = delay && delay > 0 ? ` (${formatMessage({ id: 'meeting-delay' })} +${delay}${formatMessage({ id: 'dash-days' })})` : '';
          const impText = issue.importanceNm ? ` [${issue.importanceNm}]` : '';
          lines.push(`  ${idx + 1}. [${issue.issueNo}] ${(issue.description || '').split('\n')[0].substring(0, 50)}${delayText}${impText}`);
        });
        lines.push('');
      }

      // 주요 진행 이슈
      if (summary.openIssues.length > 0) {
        lines.push(`${formatMessage({ id: 'meeting-main-issues' })}`);
        summary.openIssues.slice(0, 5).forEach((issue, idx) => {
          const manager = issue.issueManagerNm || issue.assignedTo || '-';
          const endDt = issue.finDt ? dayjs(issue.finDt).format('MM-DD') : '-';
          lines.push(`  ${idx + 1}. [${issue.issueNo}] ${(issue.description || '').split('\n')[0].substring(0, 45)} (${formatMessage({ id: 'meeting-manager' })}: ${manager}, ${formatMessage({ id: 'meeting-due' })}: ${endDt})`);
        });
        lines.push('');
      }

      // 최근 완료
      if (summary.recentClosed.length > 0) {
        lines.push(`${formatMessage({ id: 'meeting-recent-closed' })}`);
        summary.recentClosed.slice(0, 5).forEach((issue, idx) => {
          const closedDt = issue.closeDt ? dayjs(issue.closeDt).format('MM-DD') : '-';
          lines.push(`  ${idx + 1}. [${issue.issueNo}] ${(issue.description || '').split('\n')[0].substring(0, 50)} (${formatMessage({ id: 'meeting-completed-date' })}: ${closedDt})`);
        });
        lines.push('');
      }

      // 액션 아이템
      lines.push(`${formatMessage({ id: 'meeting-action-items' })}`);
      if (summary.urgent.length > 0) {
        lines.push(`  - ${formatMessage({ id: 'meeting-action-urgent' }, { count: summary.urgent.length })}`);
      }
      if (summary.delayed.length > 0) {
        lines.push(`  - ${formatMessage({ id: 'meeting-action-delayed' }, { count: summary.delayed.length })}`);
      }
      if (summary.urgent.length === 0 && summary.delayed.length === 0) {
        lines.push(`  - ${formatMessage({ id: 'meeting-no-action' })}`);
      }

      return lines.join('\n');
    }, [summary, groupName, formatMessage]);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(summaryText);
        commonNotification.success(formatMessage({ id: 'msg-copied' }));
      } catch {
        commonNotification.error(formatMessage({ id: 'msg-copy-failed' }));
      }
    };

    const handlePrint = () => {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`<pre style="font-family: 'Pretendard', monospace; font-size: 13px; line-height: 1.6;">${summaryText}</pre>`);
        printWindow.document.close();
        printWindow.print();
      }
    };

    const SectionHeader = ({ title, sectionKey, count }: { title: string; sectionKey: string; count?: number }) => (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ cursor: 'pointer', py: 0.5 }}
        onClick={() => toggleSection(sectionKey)}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2" fontWeight={700}>
            {title}
          </Typography>
          {count !== undefined && (
            <Chip label={count} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
          )}
        </Box>
        {collapsedSections[sectionKey] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </Box>
    );

    return (
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        variant="temporary"
        sx={{
          '& .MuiDrawer-paper': {
            width,
            boxSizing: 'border-box',
            paddingTop: '60px'
          }
        }}
      >
        <Box display="flex" flexDirection="column" height="100%">
          {/* 헤더 */}
          <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1" fontWeight={700}>
                {formatMessage({ id: 'meeting-summary-title' })}
              </Typography>
              <IconButton size="small" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </IconButton>
            </Box>
            {groupName && (
              <Chip label={groupName} size="small" variant="outlined" sx={{ mb: 1 }} />
            )}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <ToggleButtonGroup
                value={dateRange}
                exclusive
                onChange={(_, val) => val && setDateRange(val)}
                size="small"
              >
                <ToggleButton value="7d" sx={{ fontSize: 11, py: 0.3, px: 1 }}>
                  7{formatMessage({ id: 'dash-days' })}
                </ToggleButton>
                <ToggleButton value="30d" sx={{ fontSize: 11, py: 0.3, px: 1 }}>
                  30{formatMessage({ id: 'dash-days' })}
                </ToggleButton>
                <ToggleButton value="all" sx={{ fontSize: 11, py: 0.3, px: 1 }}>
                  {formatMessage({ id: 'meeting-all' })}
                </ToggleButton>
              </ToggleButtonGroup>
              <Stack direction="row" spacing={0.5}>
                <Button size="small" startIcon={<Copy size={14} />} onClick={handleCopy} variant="outlined" sx={{ fontSize: 11 }}>
                  {formatMessage({ id: 'meeting-copy' })}
                </Button>
                <Button size="small" startIcon={<Printer size={14} />} onClick={handlePrint} variant="outlined" sx={{ fontSize: 11 }}>
                  {formatMessage({ id: 'meeting-print' })}
                </Button>
              </Stack>
            </Box>
          </Box>

          {/* 콘텐츠 */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {/* 현황 요약 */}
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                mb: 2,
                display: 'flex',
                justifyContent: 'space-around',
                backgroundColor: theme.palette.grey[50]
              }}
            >
              <Box textAlign="center">
                <Typography variant="h6" fontWeight={700} color="primary">
                  {summary.total}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatMessage({ id: 'dash-total-issues' })}
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight={700} color="warning.main">
                  {summary.open}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatMessage({ id: 'meeting-open' })}
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight={700} color="error.main">
                  {summary.delayed.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatMessage({ id: 'dash-delayed-issues' })}
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight={700} color="success.main">
                  {summary.closed}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatMessage({ id: 'meeting-closed' })}
                </Typography>
              </Box>
            </Paper>

            {/* 긴급/지연 이슈 */}
            {(summary.delayed.length > 0 || summary.urgent.length > 0) && (
              <Box mb={2}>
                <SectionHeader
                  title={formatMessage({ id: 'meeting-urgent-delayed' })}
                  sectionKey="urgentDelayed"
                  count={[...new Set([...summary.delayed, ...summary.urgent])].length}
                />
                {!collapsedSections['urgentDelayed'] && (
                  <Box mt={0.5}>
                    {[...new Set([...summary.delayed, ...summary.urgent])].slice(0, 8).map((issue) => {
                      const delay = calculateDelay(issue);
                      return (
                        <Paper
                          key={issue.oid}
                          variant="outlined"
                          sx={{ p: 1, mb: 0.8, borderLeft: `3px solid ${delay && delay > 0 ? '#f44336' : '#ff9800'}` }}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                              {issue.issueNo}
                            </Typography>
                            <Box display="flex" gap={0.5}>
                              {issue.importanceNm && (
                                <Chip label={issue.importanceNm} size="small" sx={{ height: 18, fontSize: '0.6rem' }} />
                              )}
                              {delay && delay > 0 && (
                                <Chip
                                  label={`+${delay}${formatMessage({ id: 'dash-days' })}`}
                                  size="small"
                                  sx={{ height: 18, fontSize: '0.6rem', backgroundColor: '#ffebee', color: '#c62828' }}
                                />
                              )}
                            </Box>
                          </Box>
                          <Typography variant="body2" fontSize={12} noWrap mt={0.3}>
                            {(issue.description || '').split('\n')[0]}
                          </Typography>
                        </Paper>
                      );
                    })}
                  </Box>
                )}
                <Divider sx={{ mt: 1 }} />
              </Box>
            )}

            {/* 주요 진행 이슈 */}
            {summary.openIssues.length > 0 && (
              <Box mb={2}>
                <SectionHeader
                  title={formatMessage({ id: 'meeting-main-issues' })}
                  sectionKey="mainIssues"
                  count={summary.openIssues.length}
                />
                {!collapsedSections['mainIssues'] && (
                  <Box mt={0.5}>
                    {summary.openIssues.slice(0, 5).map((issue) => (
                      <Paper key={issue.oid} variant="outlined" sx={{ p: 1, mb: 0.8 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" fontWeight={600} color="text.secondary">
                            {issue.issueNo}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontSize={11}>
                            {issue.issueManagerNm || '-'} · ~{issue.finDt ? dayjs(issue.finDt).format('MM/DD') : '-'}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontSize={12} noWrap mt={0.3}>
                          {(issue.description || '').split('\n')[0]}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                )}
                <Divider sx={{ mt: 1 }} />
              </Box>
            )}

            {/* 최근 완료 */}
            {summary.recentClosed.length > 0 && (
              <Box mb={2}>
                <SectionHeader
                  title={formatMessage({ id: 'meeting-recent-closed' })}
                  sectionKey="recentClosed"
                  count={summary.recentClosed.length}
                />
                {!collapsedSections['recentClosed'] && (
                  <Box mt={0.5}>
                    {summary.recentClosed.slice(0, 5).map((issue) => (
                      <Paper key={issue.oid} variant="outlined" sx={{ p: 1, mb: 0.8, borderLeft: '3px solid #388e3c' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" fontWeight={600} color="text.secondary">
                            {issue.issueNo}
                          </Typography>
                          <Typography variant="caption" color="success.main" fontSize={11}>
                            {formatMessage({ id: 'meeting-completed-date' })}: {issue.closeDt ? dayjs(issue.closeDt).format('MM/DD') : '-'}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontSize={12} noWrap mt={0.3}>
                          {(issue.description || '').split('\n')[0]}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    );
  }
);

MeetingSummaryDrawer.displayName = 'MeetingSummaryDrawer';

export default MeetingSummaryDrawer;
