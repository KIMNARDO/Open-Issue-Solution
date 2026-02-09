import { useMemo } from 'react';
import { useOpenIssueList } from 'api/qms/open-issue/useOpenIssueService';
import { OpenIssueType } from 'pages/qms/qms/open-issue';
import { calculateDelay } from 'pages/qms/qms/open-issue/util';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import {
  DashboardStats,
  StatusChartData,
  PriorityChartData,
  DeptChartData,
  MonthlyTrendData,
  DelayedIssueItem,
  RecentIssueItem,
  CategoryWeeklyData,
  PipelineIssueItem,
  DashboardActivity
} from '../dashboard.types';

dayjs.extend(relativeTime);

const OPEN_STATES = ['78102', '진행', '진행중', '검토중'];
const CLOSED_STATES = ['78106', '완료'];
const PENDING_STATES = ['78104', '대기'];

function isOpen(issue: OpenIssueType): boolean {
  return OPEN_STATES.includes(issue.issueState || '') || OPEN_STATES.includes(issue.issueStateNm || '');
}

function isClosed(issue: OpenIssueType): boolean {
  return CLOSED_STATES.includes(issue.issueState || '') || CLOSED_STATES.includes(issue.issueStateNm || '');
}

function isPending(issue: OpenIssueType): boolean {
  return PENDING_STATES.includes(issue.issueState || '') || PENDING_STATES.includes(issue.issueStateNm || '');
}

function isDelayed(issue: OpenIssueType): boolean {
  if (isClosed(issue)) return false;
  const delay = calculateDelay(issue);
  return delay !== null && delay > 0;
}

// 부서 매핑 (openIssueCategoryOid → 부서명/번역키)
const DEPT_MAP: Record<number, { name: string; nameKey: string }> = {
  1: { name: '영업팀', nameKey: 'dept-sales' },
  2: { name: '품질관리팀', nameKey: 'dept-quality' },
  3: { name: '기술팀', nameKey: 'dept-tech' },
  4: { name: '경영기획팀', nameKey: 'dept-planning' },
  5: { name: '구매팀', nameKey: 'dept-procurement' },
  6: { name: '생산팀', nameKey: 'dept-production' },
  7: { name: 'IT팀', nameKey: 'dept-it' },
  8: { name: '해외법인', nameKey: 'dept-overseas' }
};

// 카테고리 분류
const CATEGORY_KEYS = ['기술', '품질', '사양', '기타'] as const;
function normalizeCategory(cat: string | undefined): string {
  if (!cat) return '기타';
  if (cat.includes('기술') || cat.includes('설계')) return '기술';
  if (cat.includes('품질')) return '품질';
  if (cat.includes('사양')) return '사양';
  return '기타';
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function useDashboardData() {
  // 전체 DEPT 이슈 조회
  const { data: deptIssues, isLoading: deptLoading } = useOpenIssueList({
    openIssueType: 'DEPT'
  });

  // 전체 DEV 이슈 조회
  const { data: devIssues, isLoading: devLoading } = useOpenIssueList({
    openIssueType: 'DEV'
  });

  const allIssues = useMemo(() => {
    return [...(deptIssues || []), ...(devIssues || [])];
  }, [deptIssues, devIssues]);

  const isLoading = deptLoading || devLoading;

  // 기본 통계
  const stats: DashboardStats = useMemo(() => {
    const total = allIssues.length;
    const open = allIssues.filter(isOpen).length;
    const pending = allIssues.filter(isPending).length;
    const closed = allIssues.filter(isClosed).length;
    const delayed = allIssues.filter(isDelayed).length;
    const urgent = allIssues.filter((i) => i.importance === '5').length;
    return { total, open, pending, closed, delayed, urgent };
  }, [allIssues]);

  // 처리율
  const completionRate = useMemo(() => {
    return stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0;
  }, [stats]);

  // 상태별 도넛 차트 데이터
  const statusChartData: StatusChartData[] = useMemo(() => [
    { name: '진행', value: stats.open, color: '#3B82F6' },
    { name: '대기', value: stats.pending, color: '#faad14' },
    { name: '완료', value: stats.closed, color: '#52c41a' }
  ], [stats]);

  // 우선순위별 바 차트 데이터
  const priorityChartData: PriorityChartData[] = useMemo(() => {
    const counts: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    allIssues.forEach((i) => { if (counts[i.importance] !== undefined) counts[i.importance]++; });
    return [
      { name: '하', nameKey: 'importance-low', count: counts['1'], color: '#94a3b8' },
      { name: '중', nameKey: 'importance-medium', count: counts['2'], color: '#3B82F6' },
      { name: '상', nameKey: 'importance-high', count: counts['3'], color: '#f97316' },
      { name: '지시사항', nameKey: 'importance-instruction', count: counts['4'], color: '#8b5cf6' },
      { name: '긴급', nameKey: 'importance-urgent', count: counts['5'], color: '#ef4444' }
    ];
  }, [allIssues]);

  // 부서별 차트 데이터 (DEPT 이슈만)
  const deptChartData: DeptChartData[] = useMemo(() => {
    const deptOnly = deptIssues || [];
    const deptStats: Record<number, { open: number; closed: number; delayed: number }> = {};
    deptOnly.forEach((issue) => {
      const catId = issue.openIssueCategoryOid;
      if (!catId) return;
      if (!deptStats[catId]) deptStats[catId] = { open: 0, closed: 0, delayed: 0 };
      if (isOpen(issue) || isPending(issue)) deptStats[catId].open++;
      if (isClosed(issue)) deptStats[catId].closed++;
      if (isDelayed(issue)) deptStats[catId].delayed++;
    });
    return Object.entries(deptStats)
      .map(([catId, s]) => ({
        name: DEPT_MAP[Number(catId)]?.name || `부서 ${catId}`,
        nameKey: DEPT_MAP[Number(catId)]?.nameKey || '',
        ...s
      }))
      .sort((a, b) => (b.open + b.delayed) - (a.open + a.delayed));
  }, [deptIssues]);

  // 월별 추이 데이터 (최근 6개월)
  const monthlyTrendData: MonthlyTrendData[] = useMemo(() => {
    const months: MonthlyTrendData[] = [];
    for (let i = 5; i >= 0; i--) {
      const m = dayjs().subtract(i, 'month');
      const monthStr = m.format('YYYY-MM');
      const created = allIssues.filter((issue) =>
        issue.strDt && dayjs(issue.strDt).format('YYYY-MM') === monthStr
      ).length;
      const closed = allIssues.filter((issue) =>
        isClosed(issue) && issue.closeDt && dayjs(issue.closeDt).format('YYYY-MM') === monthStr
      ).length;
      months.push({ month: m.format('MM월'), created, closed });
    }
    return months;
  }, [allIssues]);

  // 카테고리별 주간 데이터 (Enterprise Ops 분석 차트용)
  const categoryWeeklyData: CategoryWeeklyData[] = useMemo(() => {
    const weekData: CategoryWeeklyData[] = DAY_LABELS.map((day) => ({
      day,
      기술: 0,
      품질: 0,
      사양: 0,
      기타: 0
    }));

    allIssues.forEach((issue) => {
      if (!issue.strDt) return;
      const d = dayjs(issue.strDt);
      // dayjs .day() returns 0=Sun, 1=Mon, ... 6=Sat
      const dayIndex = d.day() === 0 ? 6 : d.day() - 1; // Convert to Mon=0 ... Sun=6
      const cat = normalizeCategory(issue.category);
      if (cat === '기술') weekData[dayIndex].기술++;
      else if (cat === '품질') weekData[dayIndex].품질++;
      else if (cat === '사양') weekData[dayIndex].사양++;
      else weekData[dayIndex].기타++;
    });

    return weekData;
  }, [allIssues]);

  // 파이프라인 이슈 (AG Grid용)
  const pipelineIssues: PipelineIssueItem[] = useMemo(() => {
    return allIssues
      .map((issue) => ({
        oid: issue.oid,
        issueNo: issue.issueNo || '',
        category: normalizeCategory(issue.category),
        importance: issue.importance,
        importanceNm: issue.importanceNm,
        issueState: issue.issueState || '',
        issueStateNm: issue.issueStateNm || '',
        managerTeam: issue.managerTeam || '',
        strDt: issue.strDt || '',
        finDt: issue.finDt || '',
        delay: calculateDelay(issue) || 0,
        contents: issue.description || issue.contents || ''
      }))
      .sort((a, b) => {
        // 긴급(5) 우선, 지연 큰 순
        const impDiff = Number(b.importance || 0) - Number(a.importance || 0);
        if (impDiff !== 0) return impDiff;
        return b.delay - a.delay;
      });
  }, [allIssues]);

  // 최근 활동 데이터 (mock from recent issues)
  const recentActivities: DashboardActivity[] = useMemo(() => {
    const activities: DashboardActivity[] = [];
    const actionTypes = [
      { action: 'STATUS_CHANGED', color: '#f97316' },
      { action: 'CREATED', color: '#3B82F6' },
      { action: 'COMMENT_ADDED', color: '#52c41a' },
      { action: 'PRIORITY_CHANGED', color: '#E41B23' },
      { action: 'MANAGER_ASSIGNED', color: '#8b5cf6' }
    ];

    const sorted = [...allIssues].sort((a, b) => dayjs(b.strDt).unix() - dayjs(a.strDt).unix());
    sorted.slice(0, 8).forEach((issue, idx) => {
      const at = actionTypes[idx % actionTypes.length];
      activities.push({
        id: issue.oid,
        action: at.action,
        description: issue.description?.split('\n')[0]?.substring(0, 40) || issue.issueNo || '',
        timestamp: issue.strDt,
        issueNo: issue.issueNo || '',
        color: at.color
      });
    });
    return activities;
  }, [allIssues]);

  // 지연 이슈 목록 (심각도 순)
  const delayedIssues: DelayedIssueItem[] = useMemo(() => {
    return allIssues
      .filter(isDelayed)
      .map((issue) => ({
        oid: issue.oid,
        issueNo: issue.issueNo || '',
        contents: issue.description || issue.contents || '',
        delay: calculateDelay(issue) || 0,
        importance: issue.importance,
        importanceNm: issue.importanceNm,
        managerTeam: issue.managerTeam,
        finDt: issue.finDt
      }))
      .sort((a, b) => b.delay - a.delay)
      .slice(0, 10);
  }, [allIssues]);

  // 최근 등록 이슈 (최근 10건)
  const recentIssues: RecentIssueItem[] = useMemo(() => {
    return [...allIssues]
      .sort((a, b) => dayjs(b.strDt).unix() - dayjs(a.strDt).unix())
      .slice(0, 10)
      .map((issue) => ({
        oid: issue.oid,
        issueNo: issue.issueNo || '',
        contents: issue.description || issue.contents || '',
        issueStateNm: issue.issueStateNm || '',
        importance: issue.importance,
        importanceNm: issue.importanceNm,
        strDt: issue.strDt,
        managerTeam: issue.managerTeam
      }));
  }, [allIssues]);

  return {
    isLoading,
    stats,
    completionRate,
    statusChartData,
    priorityChartData,
    deptChartData,
    monthlyTrendData,
    categoryWeeklyData,
    pipelineIssues,
    recentActivities,
    delayedIssues,
    recentIssues,
    allIssues
  };
}
