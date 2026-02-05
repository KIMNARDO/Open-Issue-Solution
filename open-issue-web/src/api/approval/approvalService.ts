import { DObject } from 'api/common/common.types';
import ServiceBase from 'api/ServiceBase';

class ApprovalService extends ServiceBase {
  private readonly domain: string = 'common';

  updateApprovalTask(data: any) {
    return this.service.post(`${this.domain}/approvalTask/update`, data);
  }

  selApprovalTask(data: any) {
    return this.service.post(`${this.domain}/approvalTask/sel`, data);
  }

  mytasks(data: any) {
    return this.service.post(`${this.domain}/approvalTask/mytasks`, data);
  }

  mypaytasks(data: any) {
    return this.service.post(`${this.domain}/approvalTask/mypaytasks`, data);
  }

  insertApprovalTask(data: any) {
    return this.service.post(`${this.domain}/approvalTask/insert`, data);
  }

  selApprovalStep(data: any) {
    return this.service.post(`${this.domain}/approvalStep/sel`, data);
  }

  objectApprovalStep(data: any) {
    return this.service.post(`${this.domain}/approvalStep/object`, data);
  }

  insertApprovalStep(data: any) {
    return this.service.post(`${this.domain}/approvalStep/insert`, data);
  }

  selApprovalComment(data: any) {
    return this.service.post(`${this.domain}/approvalComment/sel`, data);
  }

  insertApprovalComment(data: any) {
    return this.service.post(`${this.domain}/approvalComment/insert`, data);
  }

  deleteApprovalComment(data: any) {
    return this.service.post(`${this.domain}/approvalComment/delete`, data);
  }

  updateApproval(data: any) {
    return this.service.post(`${this.domain}/approval/update`, data);
  }

  selApproval(data: any) {
    return this.service.post(`${this.domain}/approval/sel`, data);
  }

  selApprovalNonstep(data: any) {
    return this.service.post(`${this.domain}/approval/sel-nonstep`, data);
  }

  savedNonstep(data: any) {
    return this.service.post(`${this.domain}/approval/saved-nonstep`, data);
  }

  objectApproval(data: any) {
    return this.service.post(`${this.domain}/approval/object`, data);
  }

  objectApprovalNonstep(data: any) {
    return this.service.post(`${this.domain}/approval/object-nonstep`, data);
  }

  listApproval(data: any) {
    return this.service.post(`${this.domain}/approval/list`, data);
  }

  insertApproval(data: any) {
    return this.service.post(`${this.domain}/approval/insert`, data);
  }

  inboxMyPay(data: any) {
    return this.service.post(`${this.domain}/approval/inbox/mypay`, data);
  }

  historyApproval(oid: number) {
    return this.service.post<DObject[]>(`${this.domain}/approval/history`, { oid });
  }
}

export default new ApprovalService();
