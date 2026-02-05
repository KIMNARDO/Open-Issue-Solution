import { BPolicy, BPolicyAuth, DObject, PaginationParam } from 'api/common/common.types';

export interface ProjectSearch extends PaginationParam {
  type?: string;
  bpolicyOID?: number;
  oid?: number;
  name?: string;
  description?: string;
  projectType?: string;
  oemLibOID?: number;
  carLibOID?: number;
}

export interface TempProject extends DObject {
  id?: string;
  productNm?: string;
  itemNo?: number;
  oemLibOID?: number;
  projectType?: string;
  massProdDt?: string;
}

export interface TempWBS extends DObject {
  processType: string;
  id?: number;
  dependency: string;
  dependencyType?: number;
  estStartDt?: Date;
  estEndDt?: Date;
  estDuration?: number;
  actStartDt?: Date;
  actEndDt?: Date;
  actDuration?: number;
  level?: number;
  complete?: number;
  no: string;
  //System
  rootOID?: number;
  rootNm: string;
  rootOEM: string;
  rootCarType: string;
  rootItem: string;
  delay?: number;
  approvStatus: string;
  itemNo?: number;
  oemLibOID?: number;
  carLibOID?: number;
  // members: PmsRelationship[];
  //
  progressRate?: number;
  //
  isSkipped?: number;

  gateName: string;
}

export interface OemCarData {
  checkitemtypes?: string;
  expanded?: boolean;
  gwDeptIsUse?: string;
  icon?: string;
  iconsize?: number;
  id: number;
  items?: OemCarData[];
  label: string;
  parentId?: number;
  type: string;
  value?: string;
}
export interface PmsProjectDashboard {
  OID: number;
  Name: string;
  Delay: number;
  Est: string[];
  Act: string[];
  from: string;
  to: string;
  label: string;
  customClass: string;
  name: string;
  delay: number;
  est: string[];
  act: string[];
  oid: number;
}

export interface PmsProject {
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
  row: number;
  tempPartNo: string;
  pageNum: number;
  pageCount: number;
  projectType: string;
  isTemplate: string;
  isSalesOrder: string;
  baseDt: string;
  estStartDt: string;
  estEndDt: string;
  estDuration: number;
  actStartDt: string;
  actEndDt: string;
  actDuration: number;
  workingDay: number;
  calendarOID: number;
  complete: number;
  pmOID: number;
  pmNm: string;
  templateOID: number;
  baseProjectOID: number;
  estDisposalDt: string;
  massProdDt: string;
  disconDt: string;
  templateContent: string;
  oemLibOID: number;
  carLibOID: number;
  itemNo: number;
  itemMiddle: number;
  projectGrade: string;
  customerOID: number;
  productNm: string;
  oemLibNm: string;
  carLibNm: string;
  itemNoNm: string;
  itemMiddleNm: string;
  customerNm: string;
  count: number;
  gatePolicy: number[];
  gatePercent: number[];
  totalCnt: number;
  prepareCnt: number;
  processCnt: number;
  delayCnt: number;
  startCnt: number;
  completeCnt: number;
  delayCompleteCnt: number;
  issueCnt: number;
  pausedCnt: number;
  gateReviewCnt: number;
  directRate: number;
  date: string[];
  prepare: number[];
  delay: number[];
  start: number[];
  forecast: string;
  wrCreateStore: string;
  chartDate: string;
  devCost: number;
  moldCost: number;
  equipCost: number;
  targetCost: number;
  standardCostColor: string;
  progressRate: number;
  detailStatus: number;
  salesOrderOID: number;
  salesOrderNm: string;
  salesOrderOIDs: number[];
  salesOrderOBNO: string;
  itemGroupCd: string;
  isChangeOrder: string;
  pmsDashboard: PmsProjectDashboard[];
}

export interface PmsProjectSearch extends PaginationParam {
  searchWord?: string;
}
