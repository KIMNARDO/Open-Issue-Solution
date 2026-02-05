import { ProjectDocument } from 'api/project/project.types';
import { ApprovalDetail, ApprovalLineUsers, ApprovalPayload } from './task.types';
import taskService from './taskService';

type queryKeyNames =
  | 'taskList'
  | 'taskDetail'
  | 'approvalComments'
  | 'approvalTree'
  | 'approvalDocs'
  | 'approvalLines'
  | 'workList'
  | 'approvalLineUsers'
  | 'approvalHistory'
  | 'workDashboard'
  | 'myAvailableDeployment'
  | 'myCurrentApproval'
  | 'qmsDashboard'
  | 'partItemDashboard'
  | 'asDashboard'
  | 'projectDashboard';
type mutateKeyNames = 'createApproval' | 'rejectApproval' | 'approve' | 'projectApprove' | 'createApprovalLine';

export const queryKeys: Record<queryKeyNames, any> = {
  taskList: () => ['task', 'list'] as const,
  taskDetail: (approvalUid: number) => ['task', 'detail', approvalUid] as const,
  approvalComments: (approvalUid: number) => ['task', 'approvalComments', approvalUid] as const,
  approvalTree: (targetType: string, approvalUid: number) => ['task', 'approvalTree', targetType, approvalUid] as const,
  approvalDocs: (approvalUid: number, approvalTaskUid: number) => ['task', 'approvalDocs', approvalUid, approvalTaskUid] as const,
  approvalLines: () => ['task', 'approvalLines'] as const,
  workList: () => ['task', 'workList'] as const,
  approvalLineUsers: (approvalLineUid: number) => ['task', 'approvalLineUsers', approvalLineUid] as const,
  approvalHistory: (targetUid: number) => ['task', 'approvalHistory', targetUid] as const,
  workDashboard: () => ['task', 'workDashboard'] as const,
  myAvailableDeployment: () => ['task', 'myAvailableDeployment'] as const,
  myCurrentApproval: () => ['task', 'myCurrentApproval'] as const,
  qmsDashboard: () => ['task', 'qmsDashboard'] as const,
  partItemDashboard: () => ['task', 'partItemDashboard'] as const,
  asDashboard: () => ['task', 'asDashboard'] as const,
  projectDashboard: () => ['task', 'projectDashboard'] as const
};

export const mutateKeys: Record<mutateKeyNames, any> = {
  createApproval: () => ['task', 'create'] as const,
  rejectApproval: () => ['task', 'reject'] as const,
  approve: () => ['task', 'approve'] as const,
  projectApprove: () => ['task', 'projectApprove'] as const,
  createApprovalLine: () => ['task', 'createApprovalLine'] as const
};

export const queryOptions = {
  taskList: () => ({
    queryKey: queryKeys.taskList(),
    queryFn: () => taskService.getTaskList()
  }),
  taskDetail: (approvalUid: number) => ({
    queryKey: queryKeys.taskDetail(approvalUid),
    queryFn: () => taskService.getTaskDetail(approvalUid),
    enabled: !!approvalUid && approvalUid > 0
  }),
  approvalComments: (approvalUid: number) => ({
    queryKey: queryKeys.approvalComments(approvalUid),
    queryFn: () => taskService.getApprovalComments(approvalUid),
    enabled: !!approvalUid && approvalUid > 0
  }),
  approvalTree: (targetType: string, approvalUid: number) => ({
    queryKey: queryKeys.approvalTree(targetType, approvalUid),
    queryFn: () => taskService.getApprovalTree(targetType, approvalUid),
    enabled: !!approvalUid && approvalUid > 0
  }),
  approvalDocs: (approvalUid: number, approvalTaskUid: number) => ({
    queryKey: queryKeys.approvalDocs(approvalUid, approvalTaskUid),
    queryFn: () => taskService.getApprovalDocs(approvalUid, approvalTaskUid),
    enabled: !!approvalUid && approvalUid > 0 && !!approvalTaskUid && approvalTaskUid > 0
  }),
  approvalLines: () => ({
    queryKey: queryKeys.approvalLines(),
    queryFn: () => taskService.getApprovalLines()
  }),
  workList: () => ({
    queryKey: queryKeys.workList(),
    queryFn: () => taskService.getWorkList()
  }),
  approvalLineUsers: (approvalLineUid: number) => ({
    queryKey: queryKeys.approvalLineUsers(approvalLineUid),
    queryFn: () => taskService.getApprovalLineUsers(approvalLineUid)
  }),
  approvalHistory: (targetUid: number, type: any) => ({
    queryKey: queryKeys.approvalHistory(targetUid),
    queryFn: () => taskService.getApprovalHistory(targetUid, type),
    enabled: !!targetUid && targetUid > 0
  }),
  workDashboard: () => ({
    queryKey: queryKeys.workDashboard(),
    queryFn: () => taskService.getWorkDashboard()
  }),
  myAvailableDeployment: () => ({
    queryKey: queryKeys.myAvailableDeployment(),
    queryFn: () => taskService.getMyAvailableDeployment()
  }),
  myCurrentApproval: () => ({
    queryKey: queryKeys.myCurrentApproval(),
    queryFn: () => taskService.getMyCurrentApproval()
  }),
  qmsDashboard: () => ({
    queryKey: queryKeys.qmsDashboard(),
    queryFn: () => taskService.getQmsDashboard()
  }),
  partItemDashboard: () => ({
    queryKey: queryKeys.partItemDashboard(),
    queryFn: () => taskService.getPartItemDashboard()
  }),
  asDashboard: () => ({
    queryKey: queryKeys.asDashboard(),
    queryFn: () => taskService.getAsDashboard()
  }),
  projectDashboard: () => ({
    queryKey: queryKeys.projectDashboard(),
    queryFn: () => taskService.getProjectDashboard()
  })
};

export const mutateOptions = {
  createApproval: () => ({
    mutationKey: mutateKeys.createApproval(),
    mutationFn: (payload: ApprovalPayload) => taskService.createApproval(payload)
  }),
  rejectApproval: () => ({
    mutationKey: mutateKeys.rejectApproval(),
    mutationFn: (payload: ApprovalDetail) => taskService.rejectApproval(payload)
  }),
  approve: () => ({
    mutationKey: mutateKeys.approve(),
    mutationFn: (payload: ApprovalDetail) => taskService.approve(payload)
  }),
  projectApprove: () => ({
    mutationKey: mutateKeys.projectApprove(),
    mutationFn: (payload: { approvalUid: number; approvalTaskUid: number; comment: string; docs: ProjectDocument[] }) =>
      taskService.projectApprove(payload)
  }),
  createApprovalLine: () => ({
    mutationKey: mutateKeys.createApprovalLine(),
    mutationFn: (payload: { approvalLineUid: number; approvalLineName: string; steps: ApprovalLineUsers[] }) =>
      taskService.createApprovalLine(
        { approvalLineUid: payload.approvalLineUid, approvalLineName: payload.approvalLineName },
        payload.steps
      )
  })
};
