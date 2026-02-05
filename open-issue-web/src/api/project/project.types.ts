import { RevisionObject } from 'api/common/common.types';
import { CommonFile } from 'api/file/file.types';
import { RowDataBase } from 'components/grid/grid.types';
import { BlobPayload } from 'types/commonUtils.types';
import * as yup from 'yup';

export const projectSchema = yup.object({
  pjtSeq: yup.number().required().default(-1),
  pjtNo: yup.string().required('프로젝트 NO는 필수 항목입니다').min(1, '프로젝트 NO는 필수 항목입니다').default(''),
  pjtName: yup.string().required('프로젝트명은 필수 항목입니다').min(1, '프로젝트명은 필수 항목입니다').default('')
});

/**
 * @description 프로젝트
 */
export interface Project extends SAPProject {
  uid: number;
  projectUid: number;
  projectNo: string;
  sapSeq: number;
  status: string;
  title: string;
  type: string;
  useAt: string;
  regDt?: string;
  modDt?: string;
  regUid?: number;
  modUid?: number;
  regUserName?: string;
  modUserName?: string;
}

/**
 * @description SAP 프로젝트 ( 연동 객체 )
 */
export interface SAPProject {
  pjtSeq: number;
  pjtNo: string;
  pjtName: string;
  pjtTypeName: string;
  regDate: string;
  umpjtGroupName?: string;
  umpjtGubn1Name?: string;
  umpjtGubn2Name?: string;
  umpjtGubn3Name?: string;
  deptName?: string;
  empName?: string;
  umnationName?: string;
  umpjtStatusName?: string;
  children?: SAPProject[];
}

/**
 * @description 프로젝트 관계
 */
export interface ProjectRelationship {
  uid: number;
  fromUid: number;
  toUid: number;
  projectUid: number;
  title: string;
  type: string;
}

/**
 * @description 프로젝트 문서현황표 정보
 */
export interface DocumentInfo {
  modDt?: string;
  modUid?: number;
  modUserName?: string;
  projectDocUid: number;
  projectUid: number;
  regDt?: string;
  regUid?: number;
  regUserName?: string;
  number: number;
  respondedDt: string;
  submittedDt: string;
  tdSubmittedDt: string;
  status: string;
}

/**
 * @description 프로젝트 문서
 */
export interface ProjectDocument extends RevisionObject {
  projectUid: number;
  projectDocUid: number;
  projectDocTitle: string;
  type: string;
  docStatus?: string;
  status?: string;
  projectDocNo?: string;
  supplierDocNo?: string;
  revision: string;
  tdSubmittedDt?: string;
  submittedDt?: string;
  respondedDt?: string;
  regDt?: string;
  regUid?: number;
  regUserName?: string;
  modDt?: string;
  modUid?: number;
  modUserName?: string;
  atchFileId?: string;
  submitNum?: number;
  approvalType?: string;
  approvalTypeNm?: string;
  deptManager?: string;
  manager?: string;
  parentDoc?: string;
  documentInfo?: DocumentInfo[];
  attachedFilesBlob?: File[];
  attachFiles?: CommonFile[];
}

/**
 * @description 프로젝트 검색
 */
export type ProjectSerach = Partial<Project> & { startDate?: string; endDate?: string };

/**
 * @description 프로젝트 문서 Blob payload ( 파일 등 )
 */
export type ProjectDocumentBlobPayload = BlobPayload<Partial<ProjectDocument>>;

/**
 * @description 프로젝트 상세 검색
 */
export interface PjtDetailSearch {
  uid?: number;
  sapSeq?: number;
  projectUid?: number;
}

/**
 * @description 프로젝트문서 일괄수정용 payload
 */
export interface PjtBatchPayload extends Partial<Pick<ProjectDocument, 'manager' | 'deptManager' | 'tdSubmittedDt'>> {
  projectUid: number;
  projectDocUidList: number[];
}

/**
 * @description 작업의뢰서
 */
export interface WorkOrder extends RowDataBase {
  regUid?: number;
  regUserName?: string;
  regDt?: string;
  modUid?: number;
  modUserName?: string;
  modDt?: string;
  uid?: number;
  bizNo: string;
  contractDate: string;
  cpoNo: string;
  custName: string;
  custSeq: number;
  deptName: string;
  empName: string;
  orderDate: string;
  orderNo: string;
  orderSeq: number;
  pjtSeq: number;
  smExpKindName: string;
  umOrderKindName: string;
}
