import { useMutation, useQuery } from '@tanstack/react-query';
import { mutateOptions, queryOptions } from './project.queries';
import { PjtDetailSearch } from './project.types';

export const useSapProjectList = () => useQuery(queryOptions.sapProjectList({}));
export const useProjectList = () => useQuery(queryOptions.projectList());
export const useProjectFolder = (sapSeq: number) => useQuery(queryOptions.projectFolder(sapSeq));
export const useProjectFolderWithFlag = (sapSeq: number, enabled?: boolean) => useQuery({ ...queryOptions.projectFolder(sapSeq), enabled });
export const useProjectDocument = (projectSeq?: number, projectDocUid?: number) =>
  useQuery(queryOptions.projectDocument(projectSeq ?? -1, projectDocUid ?? -1));
export const useDocumentStatusTable = (projectUid: number) => useQuery(queryOptions.documentStatusTable(projectUid));
export const useSAPProject = (sapSeq: number) => useQuery(queryOptions.sapProject(sapSeq));
export const useProjectDetail = (param: PjtDetailSearch) => useQuery(queryOptions.projectDetail(param));
export const useProjectDepFolder = (sapSeq: number, deploymentId: number) => useQuery(queryOptions.projectDepFolder(sapSeq, deploymentId));
export const useOrderList = (pjtSapSeq: number) => useQuery(queryOptions.orderList(pjtSapSeq));
export const useOrderDetail = (sapSeq: number, orderSeq: number) => useQuery(queryOptions.orderDetail(sapSeq, orderSeq));
export const useDocumentHistory = (tdmxUid: string) => useQuery(queryOptions.documentHistory(tdmxUid));

export const useCreateFolder = () => useMutation(mutateOptions.createFolder());
export const useModifyPjtDocument = () => useMutation(mutateOptions.modifyPjtDocument());
export const useModifyPjtFolder = () => useMutation(mutateOptions.modifyPjtFolder());
export const useBatchPjtDocumentManager = () => useMutation(mutateOptions.batchPjtDocumentManager());
export const useBatchPjtDocumentTdSubmittedDate = () => useMutation(mutateOptions.batchPjtDocumentTdSubmittedDate());
export const useCreateProjectAppDrawing = () => useMutation(mutateOptions.createProjectAppDrawing());
export const useReviseProjectDocument = () => useMutation(mutateOptions.reviseProjectDocument());
