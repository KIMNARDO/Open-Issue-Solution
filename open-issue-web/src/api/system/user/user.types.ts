import { DObject } from 'api/common/common.types';
import * as yup from 'yup';

export type User = {
  id: string;
  password: string;
  email: string;
  rank?: string;
  enterDt?: string;
  phone?: string;
  departmentOid?: string;
  departmentNm?: string;
  isUse: number;
  imgSign?: string;
  jobTitleOid?: string;
  jobTitleNm?: string;
  jobPositionOid?: string;
  jobPositionNm?: string;
  personNm?: string;
  hiddenGuest?: number;
  empNo?: string;
  lastLogin?: string;
  itemOid?: string;
  nation?: string;
  jobGroupOid?: string;
  jobGroupNm?: string;
  externalUser?: string;
  check2FA?: number;

  grpUid: number;
  groupAuthority: GroupAuthority[];

  authorities: any[];
  token: Token;

  initPassword: string;
  inactive: string;

  isNew: boolean;
  isUpdated: boolean;
} & DObject;

export type AccountType = 'S' | 'P' | 'G';

export const ACCOUNT_TYPE: Record<string, AccountType> = {
  SYSTEM: 'S',
  USER: 'P',
  GROUP: 'G'
} as const;

export interface Token {
  authentication: string;
  refreshToken: string;
}

// const groupAuthSchema = yup.object({
//   grpUid: yup.number().required('그룹 ID는 필수입니다.'),
//   menuId: yup.string().required('메뉴 ID는 필수입니다.'),
//   menuPath: yup.string().required('메뉴 경로는 필수입니다.'),
//   deleteYn: yup.string().oneOf(['Y', 'N']).required('삭제 여부는 필수입니다.'),
//   downloadYn: yup.string().oneOf(['Y', 'N']).required('다운로드 여부는 필수입니다.'),
//   editYn: yup.string().oneOf(['Y', 'N']).required('수정 여부는 필수입니다.'),
//   printYn: yup.string().oneOf(['Y', 'N']).required('인쇄 여부는 필수입니다.'),
//   viewYn: yup.string().oneOf(['Y', 'N']).required('보기 여부는 필수입니다.'),
//   menuNm: yup.string().required('메뉴 이름은 필수입니다.'),
//   menuType: yup.string().required('메뉴 유형은 필수입니다.'),
//   menuUid: yup.number().required('메뉴 ID는 필수입니다.'),
//   parentUid: yup.number().required('부모 ID는 필수입니다.')
// });

export const userSchema = yup.object({
  name: yup.string().required('이름은 필수입니다.'),
  empNo: yup.string().required('사번은 필수입니다.'),
  id: yup.string().required('ID는 필수입니다.'),
  password: yup.string().required('비밀번호는 필수입니다.'),
  email: yup.string().required('이메일은 필수입니다.'),
  rank: yup.string().optional().nullable(),
  enterDt: yup.string().optional().nullable(),
  phone: yup.string().required('핸드폰번호는 필수입니다.'),
  departmentOid: yup.string().optional().nullable(),
  departmentNm: yup.string().optional().nullable(),
  isUse: yup.number().oneOf([0, 1]).required('사용 여부는 필수입니다.'),
  imgSign: yup.string().optional().nullable(),
  jobTitleOid: yup.string().optional().nullable(),
  jobTitleNm: yup.string().optional().nullable(),
  jobPositionOid: yup.string().optional().nullable(),
  jobPositionNm: yup.string().optional().nullable(),
  check2FA: yup.number().oneOf([0, 1]).required('check2FA 여부는 필수입니다.')
  // isNew: yup.boolean().default(false),
  // isUpdated: yup.boolean().default(false)
});

export type UserValidationType = yup.InferType<typeof userSchema> & DObject;

export type UserPartialType = Partial<User>;

export interface CreateUser {
  accountId: string;
  accountName: string;
  accountNickname: string;
  accountType: AccountType;
}

export interface GroupAuthority {
  grpUid: number;
  menuCd: string;
  menuId: string;
  menuPath: string;
  delPermAt: string;
  regPermAt: string;
  modPermAt: string;
  viewPermAt: string;
  execPermAt: string;
  menuNm: string;
  menuType: string;
  menuUid: number;
  parentUid: number;
}

export type GroupAuthKey = keyof Pick<GroupAuthority, 'delPermAt' | 'regPermAt' | 'modPermAt' | 'viewPermAt' | 'execPermAt'>;

export interface GwDepartment {
  code: string;
  koName?: string;
  enName?: string;
  jpName?: string;
  zhcnName?: string;
  zhtwName?: string;
  viName?: string;
  deptEmail?: string;
  parentCode?: string;
  parentName?: string;
  sortOrder?: string;
  deptAlias?: string;
}

export interface Organization {
  key: string;
  title: string;
  data?: UserValidationType;
  people?: UserValidationType[];
  children?: Organization[];
}
