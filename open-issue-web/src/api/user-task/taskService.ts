import ServiceBase from 'api/ServiceBase';
import {
  Approval,
  ApprovalDetail,
  ApprovalLine,
  ApprovalLineUsers,
  ApprovalPayload,
  ApprovalTask,
  AsDashboardContent,
  CurrentMyApproval,
  CurrentMyWork,
  CurrentPartItem,
  CurrentQms,
  ProjectDashboardContent
} from './task.types';
import { RcTreeNode } from 'components/treeView/RcTreeview';
import { ProjectDocument } from 'api/project/project.types';
import { Distribution } from 'api/distribution/dist.types';

class TaskService extends ServiceBase {
  getTaskList() {
    return this.service.get<RcTreeNode<Approval>[]>('approval/my');
  }
  getTaskDetail(approvalUid: number) {
    return this.service.get<ApprovalDetail>(`approval/my/task/${approvalUid}`);
  }

  getApprovalComments(approvalUid: number) {
    return this.service.get<ApprovalTask[]>(`approval/my/task/comment/${approvalUid}`);
  }

  getApprovalTree(targetType: string, approvalUid: number) {
    return this.service.get<RcTreeNode>(`approval/my/task/${targetType}/${approvalUid}`);
  }

  getApprovalDocs(approvalUid: number, approvalTaskUid: number) {
    return this.service.get<ProjectDocument[]>(`approval/my/find/project/${approvalUid}/${approvalTaskUid}`);
  }

  getApprovalLines() {
    return this.service.get<ApprovalLine[]>('approval/line');
  }

  getApprovalLineUsers(approvalLineUid: number) {
    return this.service.get<ApprovalLineUsers[]>(`approval/line/${approvalLineUid}`);
  }

  getWorkList() {
    return this.service.get<RcTreeNode>('work/my');
  }

  getMyCurrentApproval() {
    return this.service.get<CurrentMyApproval[]>('work/approval/dashBoard');
  }

  getApprovalHistory(targetUid: number, type: any) {
    return this.service.get<ApprovalTask[]>(`approval/history/${targetUid}`, { params: { type } });
  }

  createApprovalLine(
    { approvalLineUid, approvalLineName }: { approvalLineUid: number; approvalLineName: string },
    payload: ApprovalLineUsers[]
  ) {
    return this.service.post<ApprovalTask[]>('approval/line', payload, { params: { approvalLineUid, approvalLineName } });
  }

  createApproval(payload: ApprovalPayload) {
    return this.service.post<Approval>('approval', payload);
  }

  rejectApproval(payload: ApprovalDetail) {
    return this.service.post<ApprovalDetail>(`approval/my/reject/${payload.approvalUid}/${payload.uid}`, null, {
      params: { comment: payload.comment }
    });
  }

  approve(payload: ApprovalDetail) {
    return this.service.post<ApprovalDetail>(`approval/my/approve/${payload.approvalUid}/${payload.uid}`, null, {
      params: { comment: payload.comment }
    });
  }

  projectApprove(payload: { approvalUid: number; approvalTaskUid: number; comment: string; docs: ProjectDocument[] }) {
    return this.service.post<ApprovalDetail>(
      `approval/my/approve/project/${payload.approvalUid}/${payload.approvalTaskUid}`,
      payload.docs,
      {
        params: { comment: payload.comment }
      }
    );
  }

  // dashboard content
  getWorkDashboard() {
    return this.service.get<CurrentMyWork[]>('work/my/dashBoard');
  }

  getQmsDashboard() {
    return this.service.get<CurrentQms>('work/qms/dashBoard');
  }

  getProjectDashboard() {
    return this.service.get<ProjectDashboardContent[]>('work/project/dashBoard');
  }

  getMyAvailableDeployment() {
    return this.service.get<Distribution[]>('work/deployment/dashBoard');
  }

  getPartItemDashboard() {
    return this.service.get<CurrentPartItem[]>('work/item/dashBoard');
  }

  getAsDashboard() {
    return this.service.get<AsDashboardContent>('work/as/dashBoard');
  }
}

export default new TaskService();
