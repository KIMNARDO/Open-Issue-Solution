/**
 * @description 리비전 시스템이 있는 객체의 공통 속성
 */
export interface RevisionObject {
  isLatest: 0 | 1;
  tdmxUid: string;
}

export enum CommonDocStatus {
  PROGRESS = 'PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETE = 'COMPLETE',
  APPROVAL = 'APPROVAL'
}

export interface PaginationParam {
  currentPage?: number;
  pageSize?: number;
}

export interface DObject {
  oid: number;
  name: string;
  type: string;
  description: string;
  tableNm: string;
  bpolicy: BPolicy;
  bpolicyOID: number;
  bpolicyNm: string;
  bpolicyAuths: BPolicyAuth[];
  revision: string;
  tdmxOID: string;
  isLatest: number;
  isReleasedLatest: number;
  thumbnail: string;
  createDt: string;
  createUs: number;
  createUsNm: string;
  modifyDt: string;
  modifyUs: number;
  modifyUsNm: string;
  deleteDt: string;
  deleteUs: number;
  oids: number[];
  gwDeptId: number;
  gwDeptCode: string;
  gwDeptIsUse: number;
  gwDeptIds: number[];
}

export interface BPolicy {
  oid?: number | null;
  type: string;
  name: string;
  statusOID?: number | null;
  statusNm: string;
  checkProgram: string;
  actionProgram: string;
  statusOrd?: number | null;
  isRevision: string;
  beforeActionOID: string;
  nextActionOID: string;
  oids: number[];
}

export interface BPolicyAuth {
  oid?: number | null;
  policyOID?: number | null;
  authTargetOID?: number | null;
  authTargetDiv: string;
  authNm: string;
  authTitle: string;
  authDiv: string;
  authObjectOID?: number | null;
  // ETC
  type: string;
  name: string;
}
