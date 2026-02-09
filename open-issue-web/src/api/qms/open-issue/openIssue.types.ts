import { DObject } from 'api/common/common.types';
import { RowDataBase } from 'components/grid/grid.types';
import * as yup from 'yup';

export type Issue = {
  regUid: number;
  regNm: string;
  regDt: string;
  modUid: number;
  modDt: string;
  modNm: string;
  issueType: string;
  production: string;
  client: string;
  category: string;
  item: string;
  program: string;
  gate: string;
  description: string;
  managerTeam: string;
  reportYn: string;
  priority: string;
  status: string;
  delay: string;
  strDt: string;
  finDt: string;
  duration: number;
  sop: string;
  precedessors: string;
  remark: string;
};

export const issueSchema = yup.object({
  issueType: yup.string().required('카테고리는 필수항목입니다.').default(''),
  issueTypeEtc: yup.string().optional().default(''),
  issueTypeArr: yup.array().of(yup.string().required()).default([]),
  placeOfIssue: yup.string().required('구분은 필수항목입니다.').default(''),
  productionSite: yup.string().required('양산처는 필수항목입니다.').default(''),
  // oemLibOID: yup.string().required('고객사는 필수항목입니다.').default(''),
  // itemNo: yup.string().required('품목은 필수항목입니다.').default(''),
  projectOID: yup.number().required('프로그램은 필수항목입니다.').min(1, '프로그램은 필수항목입니다.').default(-1),
  projectType: yup.string().required('프로젝트 타입은 필수항목입니다.').default(''),
  gate: yup.string().required('게이트 단계는 필수항목입니다.').default(''),
  description: yup.string().optional().default(''),
  manager: yup.string().optional().default(''),
  managerNm: yup.string().optional().default(''),
  management: yup.string().optional().default('N'),
  importance: yup.string().optional().default(''),
  //status: yup.string().optional(),
  strDt: yup.string().optional(),
  finDt: yup.string().optional(),
  duration: yup.string().optional(),
  sop: yup.string().optional(),
  predecessors: yup
    .array(
      yup.object({
        oid: yup.number().required('사용자 ID는 필수입니다.').default(0),
        id: yup.string().required('계정 ID는 필수입니다.').min(4, '계정 ID는 최소 4자 이상이어야 합니다.').default(''),
        name: yup.string().required('이름은 필수입니다.').min(1, '이름은 최소 1자 이상이어야 합니다.').default('')
      })
    )
    .optional()
    .default([]),
  replaceMembers: yup.string().optional(),
  remark: yup.string().optional()
});

export type IssueValidationType = yup.InferType<typeof issueSchema> & {
  openIssueType?: string;
  oemNm?: string;
  itemNm?: string;
  deptProjectNm?: string;
  deptItemNm?: string;
  deptCustomerNm?: string;
  openIssueGroup?: number;
  openIssueGroupList?: number[];
  openIssueCategoryOid?: number;
};

export type OpenIssueSearch = Partial<IssueValidationType> & {
  searchWord?: string;
};

export interface OpenIssueMenu {
  key: string;
  title: string;
  labelKey?: string;
  type: string;
  data: any;
  children: OpenIssueMenu[];
}

export interface OpenIssueRelationship extends RowDataBase {
  oid: number;
  rootOid: number;
  fromOID: number;
  toOID: number;
  type: string;
  roleOID: number;
  createDt?: string;
  createUs?: string;
  deleteDt?: string;
  deleteUs?: string;
  action?: string;
}

export interface OpenissueGroup extends DObject {
  fromOid: number;
  groupType: string;
  groupDepartmentOid: number;
  openIssueRelationship?: Partial<OpenIssueRelationship>[];
  groupCategory?: Partial<OpenissueGroupCategory>[];
  groupStatus?: string;
  ord?: number;
}

export interface OpenissueGroupMember {
  oid: number;
  fromOID: number;
  toOID: number;
  type: string;
  roleOid: number;
  createDt?: string;
  createUs?: number;
  deleteDt?: string;
  deleteUs?: number;
  startDate?: string;
  endDate?: string;
  personNm?: string;
  departmentNm?: string;
  jobTitleNm?: string;
  jobTitleOrd?: number;
  thumbnail?: string;
  email?: string;
  rootOid?: number;
  action?: string;
}

export interface OpenissueComment {
  oid: number;
  openIssueOid: number;
  comment: string;
  createDt?: string;
  createUs?: number;
  createUsNm?: string;
  deleteDt?: string;
  deleteUs?: number;
  deleteUsNm?: string;
}

export interface OpenissueGroupCategory {
  oid: number;
  openIssueGroupCategoryOid: number;
  ord?: number;
  value: string;
  createDt?: string;
  createUs?: number;
  deleteDt?: string;
  deleteUs?: number;
  action?: string;
}
