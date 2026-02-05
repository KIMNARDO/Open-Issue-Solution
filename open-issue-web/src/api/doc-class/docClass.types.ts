import { DObject } from 'api/common/common.types';

export interface DocClassification extends DObject {
  fromOID: string;
  classification: string;
  viewUrl: string;
  isUse: string;
  code: string;
  isRequired: string;
  excelContent: string;
  children?: DocClassification[];
}

export type DocClassSearch = Partial<DocClassification>;
