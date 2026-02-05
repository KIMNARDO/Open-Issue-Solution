import ServiceBase from 'api/ServiceBase';
import { BOM, PartItem, PartItemBlobPayload, PartItemRelation } from './item.types';

class ItemService extends ServiceBase {
  // POST
  //   부품마스터 수정
  modifyItem = (payload: PartItemBlobPayload) => {
    return this.service.postBlob<PartItem>(`item/modify/${payload.data.uid}`, payload);
  };

  // GET
  //   부품마스터 조회 (리스트)
  findItemList = (param: Partial<PartItem>) => {
    return this.service.get<PartItem[]>('item', { params: param });
  };

  // GET
  //   부품마스터 조회 (상세)
  findItem = (uid: number) => {
    return this.service.get<PartItem>(`item/${uid}`);
  };

  // GET
  //   연관 부품 리스트 조회 (연관부품)
  findRelationItemList = (itemNo: string) => {
    return this.service.get<PartItemRelation[]>('item/relation/findItemList', { params: { itemNo } });
  };

  // GET
  //   연관 부품 리스트 조회(STD_ITEM_SEQ)
  findRelationStdItemSeqList = (stdItemSeq: string) => {
    return this.service.get<PartItemRelation[]>(`item/relation/findStdItemSeqList/${stdItemSeq}`);
  };

  // GET
  //   주문번호 조회 (리스트)
  findOrderNoItemList = (orderSeq: number) => {
    return this.service.get<PartItemRelation[]>(`item/findOrderNoItemList/${orderSeq}`);
  };

  // GET
  //   BOM 조회 (리스트)
  findBomList = (stdItemSeq: string) => {
    return this.service.get<BOM[]>('item/Bom/findBomList', { params: { stdItemSeq } });
  };

  // GET
  //   부품 마스터 리비전 조회
  findRevision = (tdmxUid: string) => {
    return this.service.get<PartItem[]>(`item/revision/${tdmxUid}`);
  };

  // POST
  //   부품 마스터 개정
  reviseItem = (uid: number) => {
    return this.service.post<PartItem>(`item/rev/${uid}`);
  };
}

export default new ItemService();
