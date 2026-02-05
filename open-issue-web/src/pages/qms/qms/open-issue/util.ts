import { User } from 'api/system/user/user.types';
import { OpenIssueType } from '.';
import dayjs from 'dayjs';

export const checkIssueUser = (user: User | null | undefined, issue: { createUs?: number; isNew?: boolean }) => {
  if (issue.isNew) return true;
  if (!user || !issue.createUs || issue.createUs < 1 || user.oid < 1) return false;
  return user.oid === issue.createUs;
};

export const calculateDelay = (issue: OpenIssueType) => {
  const today = dayjs();
  const isRestarted = !!issue.reStartDt;
  const defaultDelay = today.diff(dayjs(issue.finDt), 'day');
  const currentActualDelay = issue.delayDt && issue.delayDt > 0 ? issue.delayDt : 0;

  if (isRestarted && issue.delayDt) {
    return (issue.reStartDt ? today.diff(dayjs(issue.reStartDt), 'day') : 0) + currentActualDelay;
  } else {
    return issue.delayDt ?? defaultDelay;
  }
};
