import { PartItem, PartItemBlobPayload } from './item.types';
import itemService from './itemService';

type queryKeyNames = 'itemList' | 'itemDetail' | 'relationItemList' | 'bomList' | 'revision' | 'relationStdItemSeqList' | 'orderNoItemList';

type mutateKeyNames = 'modifyItem' | 'reviseItem';

export const queryKeys: Record<queryKeyNames, any> = {
  itemList: (param: Partial<PartItem>) => ['item', 'list', param] as const,
  itemDetail: (uid: number) => ['item', 'detail', uid] as const,
  relationItemList: (itemNo: string) => ['item', 'relation', 'list', itemNo] as const,
  bomList: (stdItemSeq: string) => ['item', 'bom', 'list', stdItemSeq] as const,
  revision: (tdmxUid: number) => ['item', 'revision', tdmxUid] as const,
  relationStdItemSeqList: (stdItemSeq: string) => ['item', 'relation', 'list', stdItemSeq] as const,
  orderNoItemList: (orderSeq: number) => ['item', 'orderNoItemList', orderSeq] as const
};

export const mutateKeys: Record<mutateKeyNames, any> = {
  modifyItem: ['item', 'modify'] as const,
  reviseItem: ['item', 'revise'] as const
};

export const queryOptions = {
  itemList: (param: Partial<PartItem>) => ({
    queryKey: queryKeys.itemList(param),
    queryFn: () => itemService.findItemList(param)
  }),
  itemDetail: (uid: number) => ({
    queryKey: queryKeys.itemDetail(uid),
    queryFn: () => itemService.findItem(uid),
    enabled: !!uid && uid > 0
  }),
  orderNoItemList: (orderSeq: number) => ({
    queryKey: queryKeys.orderNoItemList(orderSeq),
    queryFn: () => itemService.findOrderNoItemList(orderSeq),
    enabled: !!orderSeq && orderSeq > 0
  }),
  relationItemList: (itemNo: string) => ({
    queryKey: queryKeys.relationItemList(itemNo),
    queryFn: () => itemService.findRelationItemList(itemNo),
    enabled: !!itemNo && itemNo.length > 0
  }),
  bomList: (stdItemSeq: string) => ({
    queryKey: queryKeys.bomList(stdItemSeq),
    queryFn: () => itemService.findBomList(stdItemSeq),
    enabled: !!stdItemSeq && stdItemSeq.length > 0
  }),
  revision: (tdmxUid: string) => ({
    queryKey: queryKeys.revision(tdmxUid),
    queryFn: () => itemService.findRevision(tdmxUid),
    enabled: !!tdmxUid && tdmxUid.length > 0
  }),
  relationStdItemSeqList: (stdItemSeq: string) => ({
    queryKey: queryKeys.relationStdItemSeqList(stdItemSeq),
    queryFn: () => itemService.findRelationStdItemSeqList(stdItemSeq),
    enabled: !!stdItemSeq && stdItemSeq.length > 0
  })
};

export const mutateOptions = {
  modifyItem: () => ({
    mutationKey: mutateKeys.modifyItem,
    mutationFn: (payload: PartItemBlobPayload) => itemService.modifyItem(payload)
  }),
  reviseItem: () => ({
    mutationKey: mutateKeys.reviseItem,
    mutationFn: (uid: number) => itemService.reviseItem(uid)
  })
};
