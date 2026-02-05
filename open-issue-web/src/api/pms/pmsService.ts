import ServiceBase from 'api/ServiceBase';
import { PmsProject, PmsProjectSearch, ProjectSearch, TempProject, TempWBS, OemCarData } from './pms.types';
import { User } from 'api/system/user/user.types';
import { ProjectFormData } from 'pages/project/dev/section/ProjectForm';
import { TemplateFormData } from 'pages/project-template/section/TemplateForm';

class PmsService extends ServiceBase {
  private readonly domain: string = '/pms';

  // project
  getProjects({ currentPage, pageSize, ...params }: ProjectSearch) {
    return this.service.post<TempProject[]>(`${this.domain}/projects`, params, {
      params: { offset: currentPage, limit: pageSize }
    });
  }

  getProjectDetail(pjtOid: number) {
    return this.service.get<PmsProject>(`${this.domain}/project/${pjtOid}`);
  }

  getProjectTemplateDetail(pjtOid: number) {
    return this.service.get<PmsProject>(`${this.domain}/project/${pjtOid}`, { params: { isTemplate: 'Y' } });
  }

  getProjectsRaw({ currentPage, pageSize, ...params }: ProjectSearch) {
    return this.service.postRaw<TempProject[]>(`${this.domain}/projects`, params, {
      params: { offset: currentPage, limit: pageSize }
    });
  }

  getProjectWBS(pjtUid: number) {
    return this.service.get<TempWBS[]>(`${this.domain}/project/wbs/${pjtUid}`);
  }

  getProjectMembers(pjtUid: number) {
    return this.service.get<User[]>(`${this.domain}/project/members`, { params: { rootOid: pjtUid, fromOid: pjtUid } });
  }

  // 프로젝트 일시중지
  pauseProject(oid: number) {
    return this.service.post(`${this.domain}/project/pause`, { oid });
  }

  // 프로젝트 멤버 초기화
  resetProjectMember(oid: number) {
    return this.service.post(`${this.domain}/project/member-reset`, { oid });
  }

  // 프로젝트 생성
  insertProject(payload: ProjectFormData) {
    return this.service.post(`${this.domain}/project/insert`, payload);
  }

  insertProjectTemplate(payload: TemplateFormData) {
    return this.service.post(`${this.domain}/project/insert`, payload);
  }

  updateProjectTemplate(payload: TemplateFormData) {
    return this.service.post(`${this.domain}/project/update`, payload);
  }

  // 프로젝트 삭제
  deleteProject(oid: number) {
    return this.service.post(`${this.domain}/project/delete`, { oid });
  }

  // 프로젝트 수정
  updateProject(payload: ProjectFormData) {
    return this.service.post(`${this.domain}/project/update`, payload);
  }

  // 프로젝트 PM 변경
  changeProjectManager(params: { pjtOid: number; pmOid: number }) {
    return this.service.post(`${this.domain}/project/change-pm`, null, { params });
  }

  // 차종 트리 검색
  getProjectOemCarData() {
    return this.service.get<OemCarData[]>(`${this.domain}/project/oem-car-data`);
  }

  // reliability
  updateReliability() {
    return this.service.post(`${this.domain}/reliability/update`);
  }

  updateReliabilityReport() {
    return this.service.post(`${this.domain}/reliability/report/update`);
  }

  getReliabilityReport() {
    return this.service.post(`${this.domain}/reliability/report/object`);
  }

  getReliabilityReportList() {
    return this.service.post(`${this.domain}/reliability/report/list`);
  }

  insertReliabilityReport() {
    return this.service.post(`${this.domain}/reliability/report/insert`);
  }

  getReliability() {
    return this.service.post(`${this.domain}/reliability/object`);
  }

  getReliabilityList() {
    return this.service.post(`${this.domain}/reliability/list`);
  }

  insertReliability() {
    return this.service.post(`${this.domain}/reliability/insert`);
  }

  // gate
  updateGateSignoff() {
    return this.service.post(`${this.domain}/gate/signoff/update`);
  }

  getGateSignoff() {
    return this.service.post(`${this.domain}/gate/signoff/object`);
  }

  getGateSignoffCost() {
    return this.service.post(`${this.domain}/gate/signoff/cost/object`);
  }

  getGateSignoffCostList() {
    return this.service.post(`${this.domain}/gate/signoff/cost/list`);
  }

  insertGateSignoffCost() {
    return this.service.post(`${this.domain}/gate/signoff/cost/insert`);
  }

  deleteGateSignoffCost() {
    return this.service.post(`${this.domain}/gate/signoff/cost/delete`);
  }

  getGateMeeting() {
    return this.service.post(`${this.domain}/gate/metting/object`);
  }

  getGateMeetingList() {
    return this.service.post(`${this.domain}/gate/metting/list`);
  }

  getProjectTemplates(param: PmsProjectSearch) {
    return this.service.postRaw<PmsProject[]>(`${this.domain}/projects/temp`, param, {
      params: { offset: param.currentPage, limit: param.pageSize }
    });
  }
}

export default new PmsService();
