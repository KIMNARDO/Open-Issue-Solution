export interface BDefine {
  oid: number;
  name: string;
  type: string;
  module: string;
  ord?: number;
  description?: string;
  link?: string;
}

export type BDefineSearch = Partial<BDefine>;
