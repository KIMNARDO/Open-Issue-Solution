import { OpenIssueType } from 'pages/qms/qms/open-issue';
import { IssueValidationType, OpenissueComment, OpenissueGroup, OpenIssueSearch } from './openIssue.types';
import openIssueService from './openIssueService';

type queryKeyNames =
  | 'openIssues'
  | 'openIssueMenu'
  | 'openIssueCategory'
  | 'openIssueMember'
  | 'openIssueGroupDetail'
  | 'openIssueCommentList'
  | 'openIssueCommentDetail'
  | 'openIssueGroupCategory'
  | 'activityLog';

type mutationKeyNames =
  | 'insOpenIssue'
  | 'insOpenIssueV2'
  | 'updateOpenIssue'
  | 'removeOpenIssue'
  | 'removeOpenIssueBatch'
  | 'updateGroup'
  | 'updateGroupStatus'
  | 'registGroup'
  | 'removeGroup'
  | 'removeComment'
  | 'registComment'
  | 'updateComment';

export const queryKeys: Record<queryKeyNames, any> = {
  openIssues: (issue: Partial<IssueValidationType>, lang?: string) => ['openIssue', 'list', issue, lang] as const,
  openIssueMenu: (type: string) => ['openIssue', 'menu', type] as const,
  openIssueCategory: () => ['openIssue', 'category'] as const,
  openIssueMember: (param: Partial<OpenissueGroup>) => ['openIssue', 'member', param] as const,
  openIssueGroupDetail: (oid: number) => ['openIssue', 'group', 'detail', oid] as const,
  openIssueCommentList: (openIssueOid: number) => ['openIssue', 'comment', 'list', openIssueOid] as const,
  openIssueCommentDetail: (comment: OpenissueComment) => ['openIssue', 'comment', 'detail', comment.openIssueOid, comment.oid] as const,
  openIssueGroupCategory: (openIssueCategoryOid: number) => ['openIssue', 'group', 'category', openIssueCategoryOid] as const,
  activityLog: (issueOid: number) => ['openIssue', 'activity', issueOid] as const
};

export const mutationKeys: Record<mutationKeyNames, any> = {
  insOpenIssue: () => ['openIssue', 'registration'] as const,
  insOpenIssueV2: () => ['openIssue', 'registration_v2'] as const,
  updateOpenIssue: () => ['openIssue', 'update'] as const,
  removeOpenIssue: () => ['openIssue', 'remove'] as const,
  removeOpenIssueBatch: () => ['openIssue', 'remove', 'batch'] as const,
  updateGroup: () => ['openIssue', 'group', 'update'] as const,
  updateGroupStatus: () => ['openIssue', 'group', 'status', 'update'] as const,
  registGroup: () => ['openIssue', 'group', 'registration'] as const,
  removeGroup: () => ['openIssue', 'group', 'remove'] as const,
  removeComment: () => ['openIssue', 'comment', 'remove'] as const,
  registComment: () => ['openIssue', 'comment', 'registration'] as const,
  updateComment: () => ['openIssue', 'comment', 'modify'] as const
};

export const queryOptions = {
  openIssues: (issue: OpenIssueSearch, lang?: string) => ({
    queryKey: queryKeys.openIssues(issue, lang),
    queryFn: () => openIssueService.searchOpenIssue(issue, lang)
  }),
  openIssueMenu: (type: string) => ({
    queryKey: queryKeys.openIssueMenu(type),
    queryFn: () => openIssueService.getOpenIssueMenu(type)
  }),
  openIssueCategory: () => ({
    queryKey: queryKeys.openIssueCategory(),
    queryFn: () => openIssueService.getCategory()
  }),
  openIssueMember: (param: Partial<OpenissueGroup>) => ({
    queryKey: queryKeys.openIssueMember(param),
    queryFn: () => openIssueService.getMember(param),
    enabled: !!param.fromOid && param.fromOid > 0
  }),
  openIssueGroupDetail: (oid: number) => ({
    queryKey: queryKeys.openIssueGroupDetail(oid),
    queryFn: () => openIssueService.getGroupDetail(oid),
    enabled: !!oid && oid > 0
  }),
  openIssueCommentList: (openIssueOid: number) => ({
    queryKey: queryKeys.openIssueCommentList(openIssueOid),
    queryFn: () => openIssueService.getCommentList(openIssueOid),
    enabled: !!openIssueOid && openIssueOid > 0
  }),
  openIssueCommentDetail: (comment: OpenissueComment) => ({
    queryKey: queryKeys.openIssueCommentDetail(comment),
    queryFn: () => openIssueService.getCommentDetail(comment),
    enabled: !!comment && comment.oid > 0
  }),
  openIssueGroupCategory: (openIssueCategoryOid: number) => ({
    queryKey: queryKeys.openIssueGroupCategory(openIssueCategoryOid),
    queryFn: () => openIssueService.getGroupCategory(openIssueCategoryOid),
    enabled: !!openIssueCategoryOid && openIssueCategoryOid > 0
  }),
  activityLog: (issueOid: number) => ({
    queryKey: queryKeys.activityLog(issueOid),
    queryFn: () => openIssueService.getActivityLog(issueOid),
    enabled: !!issueOid && issueOid > 0
  })
};

export const mutationOptions = {
  insOpenIssue: () => ({
    mutationKey: mutationKeys.insOpenIssue(),
    mutationFn: (issue: IssueValidationType) => openIssueService.insOpenIssue(issue)
  }),
  insOpenIssueV2: () => ({
    mutationKey: mutationKeys.insOpenIssueV2(),
    mutationFn: (issue: OpenIssueType[]) => openIssueService.insOpenIssueV2(issue)
  }),
  updateOpenIssue: () => ({
    mutationKey: mutationKeys.updateOpenIssue(),
    mutationFn: (issue: OpenIssueType[]) => openIssueService.updateOpenIssue(issue)
  }),
  removeOpenIssue: () => ({
    mutationKey: mutationKeys.removeOpenIssue(),
    mutationFn: (oid: number) => openIssueService.removeOpenIssue(oid)
  }),
  removeOpenIssueBatch: () => ({
    mutationKey: mutationKeys.removeOpenIssueBatch(),
    mutationFn: (payload: OpenIssueType[]) => openIssueService.removeOpenIssueBatch(payload)
  }),
  updateGroup: () => ({
    mutationKey: mutationKeys.updateGroup(),
    mutationFn: (payload: OpenissueGroup) => openIssueService.updateGroup(payload)
  }),
  updateGroupStatus: () => ({
    mutationKey: mutationKeys.updateGroupStatus(),
    mutationFn: (payload: OpenissueGroup) => openIssueService.updateGroupStatus(payload)
  }),
  registGroup: () => ({
    mutationKey: mutationKeys.registGroup(),
    mutationFn: (payload: Partial<OpenissueGroup>) => openIssueService.registGroup(payload)
  }),
  removeGroup: () => ({
    mutationKey: mutationKeys.removeGroup(),
    mutationFn: (oid: string) => openIssueService.removeGroup(oid)
  }),
  removeComment: () => ({
    mutationKey: mutationKeys.removeComment(),
    mutationFn: (oid: number) => openIssueService.removeComment(oid)
  }),
  registComment: () => ({
    mutationKey: mutationKeys.registComment(),
    mutationFn: (payload: Partial<OpenissueComment>) => openIssueService.registComment(payload)
  }),
  updateComment: () => ({
    mutationKey: mutationKeys.updateComment(),
    mutationFn: (payload: Partial<OpenissueComment>) => openIssueService.updateComment(payload)
  })
};
