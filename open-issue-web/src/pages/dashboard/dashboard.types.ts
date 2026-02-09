export interface DashboardStats {
  total: number;
  open: number;
  pending: number;
  closed: number;
  delayed: number;
  urgent: number;
}

export interface StatusChartData {
  name: string;
  value: number;
  color: string;
}

export interface PriorityChartData {
  name: string;
  nameKey: string;
  count: number;
  color: string;
}

export interface DeptChartData {
  name: string;
  nameKey: string;
  open: number;
  closed: number;
  delayed: number;
}

export interface MonthlyTrendData {
  month: string;
  created: number;
  closed: number;
}

export interface DelayedIssueItem {
  oid: number;
  issueNo: string;
  contents: string;
  delay: number;
  importance: string;
  importanceNm: string;
  managerTeam: string;
  finDt: string;
}

export interface RecentIssueItem {
  oid: number;
  issueNo: string;
  contents: string;
  issueStateNm: string;
  importance: string;
  importanceNm: string;
  strDt: string;
  managerTeam: string;
}

// Enterprise Ops Dashboard types

export interface CategoryWeeklyData {
  day: string;
  기술: number;
  품질: number;
  사양: number;
  기타: number;
}

export interface PipelineIssueItem {
  oid: number;
  issueNo: string;
  category: string;
  importance: string;
  importanceNm: string;
  issueState: string;
  issueStateNm: string;
  managerTeam: string;
  strDt: string;
  finDt: string;
  delay: number;
  contents: string;
}

export interface DashboardActivity {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  issueNo: string;
  color: string;
}
