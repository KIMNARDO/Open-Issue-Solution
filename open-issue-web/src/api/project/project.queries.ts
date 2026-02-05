import { AppDrawing } from 'api/app-drw/drawing.types';
import {
  PjtBatchPayload,
  PjtDetailSearch,
  ProjectDocument,
  ProjectDocumentBlobPayload,
  ProjectRelationship,
  ProjectSerach
} from './project.types';
import projectService from './projectService';

type queryKeyNames =
  | 'sapProjectList'
  | 'projectList'
  | 'projectFolder'
  | 'projectDocument'
  | 'documentStatusTable'
  | 'sapProject'
  | 'projectDetail'
  | 'projectDepFolder'
  | 'orderList'
  | 'orderDetail'
  | 'documentHistory';
type mutateKeyNames =
  | 'createFolder'
  | 'modifyPjtDocument'
  | 'modifyPjtFolder'
  | 'batchPjtDocumentManager'
  | 'batchPjtDocumentTdSubmittedDate'
  | 'createProjectAppDrawing'
  | 'reviseProjectDocument';

export const queryKeys: Record<queryKeyNames, any> = {
  projectList: () => ['project', 'list'] as const,
  sapProjectList: () => ['project', 'sapProjectList'] as const,
  projectFolder: (sapSeq: number) => ['project', 'folder', sapSeq] as const,
  projectDocument: (projectSeq: number, projectDocUid: number) => ['project', 'document', projectSeq, projectDocUid] as const,
  documentStatusTable: (projectUid: number) => ['project', 'documentStatusTable', projectUid] as const,
  sapProject: (sapSeq: number) => ['project', 'sapProject', sapSeq] as const,
  projectDetail: (param: { uid?: number; sapSeq?: number; projectUid?: number }) => ['project', 'projectDetail', param] as const,
  projectDepFolder: (sapSeq: number, deploymentId: number) => ['project', 'projectDepFolder', sapSeq, deploymentId] as const,
  orderList: (pjtSapSeq: number) => ['project', 'orderList', pjtSapSeq] as const,
  orderDetail: (sapSeq: number, orderSeq: number) => ['project', 'orderDetail', sapSeq, orderSeq] as const,
  documentHistory: (tdmxUid: string) => ['project', 'documentHistory', tdmxUid] as const
};

export const queryOptions = {
  sapProjectList: (param: ProjectSerach) => ({
    queryKey: queryKeys.sapProjectList(),
    queryFn: () => projectService.getSAPProjectList(param)
  }),
  projectList: () => ({
    queryKey: queryKeys.projectList(),
    queryFn: () => projectService.getProjectList()
  }),
  projectFolder: (sapSeq: number) => ({
    queryKey: queryKeys.projectFolder(sapSeq),
    queryFn: () => projectService.getProjectFolder(sapSeq)
  }),
  projectDocument: (projectSeq: number, projectDocUid: number) => ({
    queryKey: queryKeys.projectDocument(projectSeq, projectDocUid),
    queryFn: () => projectService.getProjectDocument(projectSeq, projectDocUid),
    enabled: !!projectSeq && projectSeq > 0 && !!projectDocUid && projectDocUid > 0
  }),
  projectDetail: (param: PjtDetailSearch) => ({
    queryKey: queryKeys.projectDetail(param),
    queryFn: () => projectService.getProjectDetail(param)
  }),
  documentStatusTable: (projectUid: number) => ({
    queryKey: queryKeys.documentStatusTable(projectUid),
    queryFn: () => projectService.getDocumentStatusTable(projectUid),
    enabled: !!projectUid && projectUid > 0
  }),
  sapProject: (sapSeq: number) => ({
    queryKey: queryKeys.sapProject(sapSeq),
    queryFn: () => projectService.getSAPProject(sapSeq)
  }),
  projectDepFolder: (sapSeq: number, deploymentId: number) => ({
    queryKey: queryKeys.projectDepFolder(sapSeq, deploymentId),
    queryFn: () => projectService.getProjectDepFolder({ sapSeq, deploymentId }),
    enabled: !!sapSeq && sapSeq > 0 && !!deploymentId && deploymentId > 0
  }),
  orderList: (pjtSapSeq: number) => ({
    queryKey: queryKeys.orderList(pjtSapSeq),
    queryFn: () => projectService.getOrderList(pjtSapSeq),
    enabled: !!pjtSapSeq && pjtSapSeq > 0
  }),
  orderDetail: (sapSeq: number, orderSeq: number) => ({
    queryKey: queryKeys.orderDetail(sapSeq, orderSeq),
    queryFn: () => projectService.getOrderById(sapSeq, orderSeq),
    enabled: !!sapSeq && sapSeq > 0 && !!orderSeq && orderSeq > 0
  }),
  documentHistory: (tdmxUid: string) => ({
    queryKey: queryKeys.documentHistory(tdmxUid),
    queryFn: () => projectService.getDocumentHistory(tdmxUid),
    enabled: !!tdmxUid && tdmxUid.length > 0
  })
};

export const mutateKeys: Record<mutateKeyNames, any> = {
  createFolder: () => ['project', 'createFolder'] as const,
  modifyPjtDocument: () => ['project', 'modifyPjtDocument'] as const,
  modifyPjtFolder: () => ['project', 'modifyPjtFolder'] as const,
  batchPjtDocumentManager: () => ['project', 'document', 'batch', 'manager'] as const,
  batchPjtDocumentTdSubmittedDate: () => ['project', 'document', 'batch', 'tdSubmittedDate'] as const,
  createProjectAppDrawing: () => ['project', 'createProjectAppDrawing'] as const,
  reviseProjectDocument: () => ['project', 'reviseProjectDocument'] as const
};

export const mutateOptions = {
  createFolder: () => ({
    mutationKey: mutateKeys.createFolder(),
    mutationFn: (payload: Partial<ProjectRelationship>) => projectService.createFolder(payload)
  }),
  modifyPjtDocument: () => ({
    mutationKey: mutateKeys.modifyPjtDocument(),
    mutationFn: (payload: ProjectDocumentBlobPayload) => projectService.modifyPjtDocument(payload)
  }),
  modifyPjtFolder: () => ({
    mutationKey: mutateKeys.modifyPjtFolder(),
    mutationFn: (payload: Partial<ProjectRelationship>) => projectService.modifyPjtFolder(payload)
  }),
  batchPjtDocumentManager: () => ({
    mutationKey: mutateKeys.batchPjtDocumentManager(),
    mutationFn: (payload: PjtBatchPayload) => projectService.batchPjtDocumentManager(payload)
  }),
  batchPjtDocumentTdSubmittedDate: () => ({
    mutationKey: mutateKeys.batchPjtDocumentTdSubmittedDate(),
    mutationFn: (payload: PjtBatchPayload) => projectService.batchPjtDocumentTdSubmittedDate(payload)
  }),
  createProjectAppDrawing: () => ({
    mutationKey: mutateKeys.createProjectAppDrawing(),
    mutationFn: (payload: Partial<AppDrawing>) => projectService.createProjectAppDrawing(payload)
  }),
  reviseProjectDocument: () => ({
    mutationKey: mutateKeys.reviseProjectDocument(),
    mutationFn: (payload: ProjectDocument) => projectService.reviseProjectDocument(payload)
  })
};
