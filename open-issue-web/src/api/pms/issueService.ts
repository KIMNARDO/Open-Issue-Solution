import ServiceBase from 'api/ServiceBase';
import { IssueDetailData } from 'pages/project/type';

class IssueService extends ServiceBase {
  private readonly domain: string = '/pms/issue';

  /**
   * 이슈 상세 정보 조회
   * @param issueId 이슈 ID
   * @returns 이슈 상세 데이터
   */
  getIssueDetail(issueId: string) {
    return this.service.get<IssueDetailData>(`${this.domain}/${issueId}`);
  }

  /**
   * 이슈 목록 조회
   * @param projectId 프로젝트 ID
   * @returns 이슈 목록
   */
  getIssueList(projectId: number) {
    return this.service.get<IssueDetailData[]>(`${this.domain}/list`, {
      params: { projectId }
    });
  }

  /**
   * 이슈 생성
   * @param payload 이슈 생성 데이터
   * @returns 생성된 이슈 ID
   */
  createIssue(payload: Partial<IssueDetailData>) {
    return this.service.post<{ id: string }>(`${this.domain}/insert`, payload);
  }

  /**
   * 이슈 수정
   * @param issueId 이슈 ID
   * @param payload 이슈 수정 데이터
   * @returns 수정 결과
   */
  updateIssue(issueId: string, payload: Partial<IssueDetailData>) {
    return this.service.post(`${this.domain}/update`, { ...payload, id: issueId });
  }

  /**
   * 이슈 삭제
   * @param issueId 이슈 ID
   * @returns 삭제 결과
   */
  deleteIssue(issueId: string) {
    return this.service.post(`${this.domain}/delete`, { id: issueId });
  }
}

export default new IssueService();
