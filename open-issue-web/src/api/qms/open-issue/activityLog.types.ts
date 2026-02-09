export type ActivityAction =
  | 'CREATED'
  | 'STATUS_CHANGED'
  | 'COMMENT_ADDED'
  | 'FILE_UPLOADED'
  | 'MANAGER_ASSIGNED'
  | 'PRIORITY_CHANGED'
  | 'DATE_CHANGED';

export interface ActivityLog {
  id: number;
  issueOid: number;
  issueNo: string;
  action: ActivityAction;
  description: string;
  oldValue?: string;
  newValue?: string;
  userName: string;
  timestamp: string; // ISO 8601
}

export const ACTION_LABELS: Record<ActivityAction, { ko: string; en: string; icon: string }> = {
  CREATED: { ko: '이슈 생성', en: 'Issue Created', icon: '🆕' },
  STATUS_CHANGED: { ko: '상태 변경', en: 'Status Changed', icon: '🔄' },
  COMMENT_ADDED: { ko: '의견 추가', en: 'Comment Added', icon: '💬' },
  FILE_UPLOADED: { ko: '파일 업로드', en: 'File Uploaded', icon: '📎' },
  MANAGER_ASSIGNED: { ko: '담당자 지정', en: 'Manager Assigned', icon: '👤' },
  PRIORITY_CHANGED: { ko: '중요도 변경', en: 'Priority Changed', icon: '⚡' },
  DATE_CHANGED: { ko: '일정 변경', en: 'Date Changed', icon: '📅' }
};
