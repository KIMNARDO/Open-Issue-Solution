import ServiceBase from 'api/ServiceBase';
import { Distribution, DistributionComment, DistributionHistory, DistributionSearch, DistributionSummary } from './dist.types';
import { TreeViewElement } from 'components/treeView/CustomRichTreeView';

class DistributionService extends ServiceBase {
  getDistributionSummary(param: DistributionSearch) {
    return this.service.post<DistributionSummary[]>(`/deployment/summary`, param);
  }
  getDistInboxSummary(param: DistributionSearch, userUid: number) {
    return this.service.post<DistributionSummary[]>(`/deployment/inbox/summary/${userUid}`, param);
  }
  getDistOutboxSummary(param: DistributionSearch, userUid: number) {
    return this.service.post<DistributionSummary[]>(`/deployment/outbox/summary/${userUid}`, param);
  }
  getDistributionDetail(deploymentUid: number) {
    return this.service.get<Distribution>(`/deployment/${deploymentUid}`);
  }
  getDistributionHistory(param: DistributionSearch) {
    return this.service.get<DistributionHistory[]>(`/deployment/history/${param.type}/${param.deployDocUid}`);
  }
  getDistributionComment(deploymentUid: number) {
    return this.service.get<TreeViewElement<DistributionComment>[]>(`/deployment/comment/${deploymentUid}`);
  }

  registTempDocument(payload: Distribution) {
    return this.service.post<Distribution>(`/deployment/temp/registration`, payload);
  }
  modifyTempDocument(payload: Distribution) {
    return this.service.post<Distribution>(`/deployment/temp/modification`, payload);
  }
  removeTempDocument(deploymentUid: number) {
    return this.service.delete(`/deployment/temp/${deploymentUid}`);
  }
  registDistribution(payload: Distribution) {
    return this.service.post<Distribution>(`/deployment/registration`, payload);
  }
  modifyDistribution(payload: Distribution) {
    return this.service.post<Distribution>(`/deployment/modification`, payload);
  }
  returnDistribution(deploymentUid: number) {
    return this.service.post(`/deployment/return/${deploymentUid}`);
  }
  expireDistribution(deploymentUid: number) {
    return this.service.post(`/deployment/expiration/${deploymentUid}`);
  }
  receiveDistribution(deploymentUid: number) {
    return this.service.post(`/deployment/receive/${deploymentUid}`);
  }
  redeployDistribution(deploymentUid: number) {
    return this.service.post(`/deployment/redeploy/${deploymentUid}`);
  }
  registDistributionComment(payload: DistributionComment) {
    return this.service.post<DistributionComment>(`/deployment/comment`, payload);
  }
  removeDistributionComment(deployCommentUid: number) {
    return this.service.post(`/deployment/comment/${deployCommentUid}`);
  }
}

export default new DistributionService();
