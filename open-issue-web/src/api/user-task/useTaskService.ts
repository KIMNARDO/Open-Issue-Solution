import { useMutation, useQuery } from '@tanstack/react-query';
import { mutateOptions, queryOptions } from './task.query';

export const useGetTaskList = () => useQuery(queryOptions.taskList());
export const useGetTaskDetail = (approvalUid: number) => useQuery(queryOptions.taskDetail(approvalUid));
export const useGetApprovalComments = (approvalUid: number) => useQuery(queryOptions.approvalComments(approvalUid));
export const useGetApprovalTree = (targetType: string, approvalUid: number) => useQuery(queryOptions.approvalTree(targetType, approvalUid));
export const useGetApprovalDocs = (approvalUid: number, approvalTaskUid: number) =>
  useQuery(queryOptions.approvalDocs(approvalUid, approvalTaskUid));
export const useGetApprovalLines = () => useQuery(queryOptions.approvalLines());
export const useGetWorkList = () => useQuery(queryOptions.workList());
export const useGetApprovalLineUsers = (approvalLineUid: number) => useQuery(queryOptions.approvalLineUsers(approvalLineUid));
export const useGetApprovalHistory = (targetUid: number, type: any) => useQuery(queryOptions.approvalHistory(targetUid, type));

// dashboard content
export const useGetWorkDashboard = () => useQuery(queryOptions.workDashboard());
export const useGetMyAvailableDeployment = () => useQuery(queryOptions.myAvailableDeployment());
export const useGetMyCurrentApproval = () => useQuery(queryOptions.myCurrentApproval());
export const useGetQmsDashboard = () => useQuery(queryOptions.qmsDashboard());
export const useGetPartItemDashboard = () => useQuery(queryOptions.partItemDashboard());
export const useGetAsDashboard = () => useQuery(queryOptions.asDashboard());
export const useGetProjectDashboard = () => useQuery(queryOptions.projectDashboard());

export const useCreateApproval = () => useMutation(mutateOptions.createApproval());
export const useRejectApproval = () => useMutation(mutateOptions.rejectApproval());
export const useApprove = () => useMutation(mutateOptions.approve());
export const useProjectApprove = () => useMutation(mutateOptions.projectApprove());
export const useCreateApprovalLine = () => useMutation(mutateOptions.createApprovalLine());
