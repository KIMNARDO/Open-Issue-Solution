import { BPolicy, BPolicyAuth, PaginationParam } from 'api/common/common.types';
import { CommonFile } from 'api/file/file.types';

export interface EbomSearch extends PaginationParam {
  searchWord?: string;
}

export interface Ebom {
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
  createDt: string; // date-time
  createUs: number;
  createUsNm: string;
  modifyDt: string; // date-time
  modifyUs: number;
  modifyUsNm: string;
  deleteDt: string; // date-time
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
  allView: string;
  partNo: string;
  partNumber: number;
  custPartNo: string;
  pmsOid: number;
  pmsNm: string;
  taskNm: string;
  title: string;
  oemLibOid: number;
  carLibOid: number;
  oemLibNm: string;
  carLibNm: string;
  korNm: string;
  materialOid: number;
  materialNm: string;
  division: string;
  divisionNm: string;
  itemNo: number;
  itemNoNm: string;
  itemMiddle: number;
  itemMiddleNm: string;
  productionPlace: number;
  productionPlaceNm: string;
  blockNo: number;
  blockNoNm: string;
  serial: string;
  selRevision: string;
  standard: string;
  partDivision: string;
  rootOID: number;
  fromOID: number;
  toOID: number;
  files: CommonFile[];
  delFiles: CommonFile[];
  isSpecPartNo: boolean;
  partName: string;
  partStandard: string;
  isDuplicate: number;
  startCreateDt: string;
  endCreateDt: string;
  orginOid: number;
  newCheck: string;
  oldOID: number;
  count: number;
  epartTypeNm: string;

  oem_Lib_OID: number;
  car_Lib_OID: number;
  oem_Lib_Nm: string;
  car_Lib_Nm: string;
  material_OID: number;
  material_Nm: string;
  item_NoNm: string;
  item_Middle: number;
  item_MiddleNm: string;
  production_Place: number;
  production_PlaceNm: string;
  block_No: number;
  block_NoNm: string;
  sel_Revision: string;
  orgin_OID: number;
  item_No: number;

  epartType: number;
}
