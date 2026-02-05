import { RevisionObject } from 'api/common/common.types';
import { CommonFile } from 'api/file/file.types';
import { BlobPayload } from 'types/commonUtils.types';

/**
 * @description 부품도면
 */
export interface PartItem extends RevisionObject {
  regUid?: number;
  regUserName?: string;
  regDt?: string;
  modUid?: number;
  modUserName?: string;
  modDt?: string;
  uid: number;
  itemName: string;
  itemNo: string;
  managerUid?: number;
  spec?: string;
  itemSeq: string;
  assetName?: string;
  unitName?: string;
  smStatusName?: string;
  type?: string;
  revision: string;
  status: string;
  atchFileId?: string;
  attachFiles?: CommonFile[];
  attachedFilesBlob?: File[];
}

export type PartItemBlobPayload = BlobPayload<PartItem>;

/**
 * @description BOM
 */
export interface BOM {
  stdItemNo: string;
  stdItemName: string;
  stdItemSeq: string;
  dwgNo: string;
  matItemNo: string;
  matItemName: string;
  matItemSeq: string;
  needQtyNumerator?: string;
  needQtyDenominator?: string;
  width?: string;
  height?: string;
  thickness?: string;
  exdiameter?: string;
  gravity?: string;
  weight?: string;
  eachQty?: string;
  remark?: string;
}

/**
 * @description 부품도면 표준부품
 */
export interface PartItemRelation {
  regUid?: number;
  regUserName?: string;
  regDt?: string;
  modUid?: number;
  modUserName?: string;
  modDt?: string;
  uid: number;
  stdItemNo: string;
  orderSerlNo: string;
  umOrderTypeName: string;
  itemName: string;
  itemNo: string;
  orderRev: string;
  umStatusName: string;
  umMaterialsName: string;
  actuator: string;
  spec: string;
  umendName: string;
  uptDate: string;
  stdItemSeq: string;
  orderSeq: string;
  orderSerl: string;
}
