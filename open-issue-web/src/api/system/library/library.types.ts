import { DObject } from 'api/common/common.types';
import { RowDataBase } from 'components/grid/grid.types';
import { v4 } from 'uuid';
import * as y from 'yup';

export const librarySchema = y.object({
  oid: y.string().required().default(''),
  regUid: y.number().optional(),
  regDt: y.string().optional(),
  modUid: y.number().optional(),
  modDt: y.string().optional(),
  code: y.string().required().default(v4()),
  codeNm: y.string().required().default(''),
  sysCode: y.string().optional(),
  parentCode: y.string().optional(),
  remark: y.string().optional(),
  ord: y.number().optional(),
  useYn: y.string().required().default('Y'),
  displayYn: y.string().optional()
});

export type DLibrary = {
  oid?: number;
  korNm?: string;
  fromOID?: number;
  toOID?: number;
  isUse: string;
  ord?: number;
  isRequired: string;
  code1: string;
  code2: string;
  isChange: string;
  isMove: string;
  isParentMove: string;
  isDelete: string;

  cData?: DLibrary[];
  fromOIDs?: number[];

  managerNm?: string;
} & DObject;

export type Library = y.InferType<typeof librarySchema> & RowDataBase;

export type LibrarySearch = Partial<Library> & {
  searchWord?: string;
};

// code library

export interface CodeLibrary extends DObject {
  oid: number;
  korNm: string;
  fromOID: number;
  isUse: string;
  ord: number;
  isRequired: string;
  code1: string;
  code2: string;
  description: string;
}

export type CodeLibrarySearch = Partial<CodeLibrary> & {
  searchWord?: string;
};

// assessment library
export interface AssessmentLibrary extends DObject {
  oid: number;
  name: string;
  ord: number;
  revision: string;
  cData?: AssessmentLibrary[];
}

export type AssessmentLibrarySearch = Partial<AssessmentLibrary> & {
  searchWord?: string;
};
