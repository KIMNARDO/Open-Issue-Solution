/**
 * @description 공통 파일 ( 데이터베이스 )
 */
export interface CommonFile {
  fileOid: number;
  oid: number;
  type: string;
  orgNm: string;
  convNm: string;
  ext: string;
  fileSize?: number;
  createDt?: string;
  createUs?: number;
  deleteDt?: string;
  deleteUs?: number;
  row?: number;
  tempPartNo?: string;
  useAt?: 'Y' | 'N';
  lastModified?: number;
  isNew?: boolean;
  base64?: string;
}
