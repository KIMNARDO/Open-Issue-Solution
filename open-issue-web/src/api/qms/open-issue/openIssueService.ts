import ServiceBase from 'api/ServiceBase';
import {
  IssueValidationType,
  OpenissueComment,
  OpenissueGroup,
  OpenissueGroupCategory,
  OpenissueGroupMember,
  OpenIssueMenu,
  OpenIssueRelationship,
  OpenIssueSearch
} from './openIssue.types';
import { OpenIssueType } from 'pages/qms/open-issue';
import { DLibrary } from 'api/system/library/library.types';

class OpenIssueService extends ServiceBase {
  getAllOpenIssue(param: OpenIssueSearch, lang?: string) {
    return this.service.post<OpenIssueType[]>('openIssue', param, { params: { lang } });
  }

  searchOpenIssue(param: OpenIssueSearch, lang?: string) {
    return this.service.post<OpenIssueType[]>('openIssue/search', null, { params: { ...param, lang } });
  }

  getCategory() {
    return this.service.get<DLibrary[]>('openIssue/category');
  }

  getOpenIssueMenu(type: string) {
    return this.service.get<OpenIssueMenu[]>(`openIssue/menu/${type}`);
  }

  insOpenIssue(param: IssueValidationType) {
    return this.service.post<IssueValidationType>(`openIssue/registration`, param);
  }

  insOpenIssueV2(param: OpenIssueType[]) {
    return this.service.post<OpenIssueType[]>(`openIssue/registration_v2`, param);
  }

  updateOpenIssue(param: OpenIssueType[]) {
    return this.service.post<OpenIssueType[]>(`openIssue/update`, param);
  }

  removeOpenIssue(oid: number) {
    return this.service.post(`openIssue/remove/${oid}`);
  }

  removeOpenIssueBatch(payload: OpenIssueType[]) {
    return this.service.post(`openIssue/remove/batch`, payload);
  }

  // group

  updateGroup(payload: OpenissueGroup) {
    return this.service.post<OpenissueGroup>(`openIssue/menu/group/update`, payload);
  }

  updateGroupStatus(payload: OpenissueGroup) {
    return this.service.post<OpenissueGroup>(`openIssue/menu/group/status/update`, payload);
  }

  registGroup(payload: Partial<OpenissueGroup>) {
    return this.service.post<OpenissueGroup>(`openIssue/menu/group/registration`, payload);
  }

  removeGroup(oid: string) {
    return this.service.post(`openIssue/menu/group/remove/${oid}`);
  }

  getMember(param: Partial<OpenissueGroup>) {
    return this.service.get<OpenissueGroupMember[]>(`openIssue/member/${param.fromOid}`);
  }

  getMemberDefault(groupType: string) {
    return this.service.get<OpenIssueRelationship[]>(`openIssue/menu/group/default/member`, { params: { groupType } });
  }

  getGroupDetail(oid: number) {
    return this.service.get<OpenissueGroup>(`openIssue/menu/group/${oid}`);
  }

  // comment

  getCommentList(openIssueOid: number) {
    return this.service.get<OpenissueComment[]>(`openIssue/comment/${openIssueOid}`);
  }

  getCommentDetail(comment: OpenissueComment) {
    return this.service.get<OpenissueComment>(`openIssue/comment/${comment.openIssueOid}/${comment.oid}`);
  }

  removeComment(oid: number) {
    return this.service.post(`openIssue/comment/remove/${oid}`);
  }

  registComment(payload: Partial<OpenissueComment>) {
    return this.service.post<OpenissueComment>(`openIssue/comment/registration`, payload);
  }

  updateComment(payload: Partial<OpenissueComment>) {
    return this.service.post<OpenissueComment>(`openIssue/comment/modify`, payload);
  }

  // group category

  getGroupCategory(openIssueCategoryOid: number) {
    return this.service.get<OpenissueGroupCategory[]>(`openIssue/group/category/${openIssueCategoryOid}`);
  }
}
export default new OpenIssueService();
