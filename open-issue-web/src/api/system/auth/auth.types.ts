export interface AuthGroup {
  regUid: number;
  regNm: string;
  regDt: string;
  modUid: number;
  modDt: string;
  modNm: string;
  grpUid: number;
  grpName: string;
  grpRemark: string;
  useAt: string;
}

export type SearchAuthGroup = Partial<AuthGroup>;

export interface Auth {
  regUid: number;
  regNm: string;
  regDt: string;
  modUid: number;
  modDt: string;
  modNm: string;
  menuUid: number;
  tempMenuUid: number;
  menuNm: string;
  menuId: string;
  parentUid: number;
  icon: string;
  menuType: string;
  ord: string;
  useYn: string;
  menuPath: string;
  menuRemark: string;
  childMenu: string;
  grpUid: number;
  grpName: string;
  // viewYn: string;
  // editYn: string;
  // deleteYn: string;
  remark: string;
  viewPermAt: string;
  modPermAt: string;
  execPermAt: string;
  delPermAt: string;
  PermAt: string;
  regPermAt: string;
  _children: Auth[];
}

export type AuthPartialType = Partial<Auth>;

export interface ExAuthGroup extends AuthGroup {
  id: string;
}

export interface ExAuth extends Auth {
  id: string;
  path: string[];
}

export interface ProductAuth {
  oid: number;
  userUid: number;
  productCd: string;
  productNm: string;
  useYn: string;
  modDt?: string;
  modNm?: string;
  modUid?: number;
  productList?: string[];
  regDt?: string;
  regNm?: string;
  regUid?: number;
}
