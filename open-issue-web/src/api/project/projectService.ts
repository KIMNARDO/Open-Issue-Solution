import ServiceBase from 'api/ServiceBase';
import {
  PjtBatchPayload,
  PjtDetailSearch,
  Project,
  ProjectDocument,
  ProjectDocumentBlobPayload,
  ProjectRelationship,
  ProjectSerach,
  SAPProject,
  WorkOrder
} from './project.types';
import { RcTreeNode } from 'components/treeView/RcTreeview';
import { AppDrawing } from 'api/app-drw/drawing.types';

class ProjectService extends ServiceBase {
  getSAPProjectList(search: ProjectSerach) {
    return this.service.get<SAPProject[]>('/project/sap', { params: search });
  }
  getProjectList() {
    return this.service.get<Project[]>('/project/list/findById');
  }
  getSAPProject(sapSeq: number) {
    return this.service.get<SAPProject>(`/project/sap/${sapSeq}`);
  }
  getProjectFolder(sapSeq: number) {
    return this.service.get<RcTreeNode>(`/project/folder/${sapSeq}`);
  }
  getProjectDepFolder({ sapSeq, deploymentId }: { sapSeq: number; deploymentId: number }) {
    return this.service.get<RcTreeNode>(`/project/folder/deployment/${deploymentId}/${sapSeq}`);
  }
  getProjectDetail(params: PjtDetailSearch) {
    return this.service.get<Project>(`/project/findById`, { params });
  }
  getProjectDocument(projectSeq: number, projectDocUid: number) {
    return this.service.get<ProjectDocument>(`/project/doc/${projectSeq}/${projectDocUid}`);
  }
  getDocumentStatusTable(projectUid: number) {
    return this.service.get<ProjectDocument[]>(`/project/doc/info/${projectUid}`);
  }
  getOrderList(pjtSapSeq: number) {
    return this.service.get<WorkOrder[]>(`/project/sap/orderRequest/${pjtSapSeq}`);
  }
  getOrderById(sapSeq: number, orderSeq: number) {
    return this.service.get<WorkOrder>(`/project/sap/orderRequest/${sapSeq}/${orderSeq}`);
  }
  getDocumentHistory(tdmxUid: string) {
    return this.service.get<ProjectDocument[]>(`/project/doc/rev/history/${tdmxUid}`);
  }

  createFolder(payload: Partial<ProjectRelationship>) {
    return this.service.post(`/project/folder`, payload);
  }
  modifyPjtDocument(payload: ProjectDocumentBlobPayload) {
    return this.service.postBlob(`/project/doc/${payload.data.projectUid}/${payload.data.projectDocUid}`, payload);
  }
  modifyPjtFolder(payload: Partial<ProjectRelationship>) {
    return this.service.post(`/project/folder/${payload.projectUid}`, payload);
  }
  batchPjtDocumentManager(payload: PjtBatchPayload) {
    return this.service.post(`/project/doc/${payload.projectUid}`, payload);
  }
  batchPjtDocumentTdSubmittedDate(payload: PjtBatchPayload) {
    return this.service.post(`/project/doc/${payload.projectUid}`, payload);
  }
  createProjectAppDrawing(payload: Partial<AppDrawing>) {
    return this.service.post(`/project/appr/registration/${payload.projectUid}`, payload);
  }
  reviseProjectDocument(payload: ProjectDocument) {
    return this.service.post(`/project/doc/rev/${payload.projectUid}/${payload.projectDocUid}`);
  }
}

export default new ProjectService();
