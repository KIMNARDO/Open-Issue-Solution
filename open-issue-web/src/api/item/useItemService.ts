import { useMutation, useQuery } from '@tanstack/react-query';
import { mutateOptions, queryOptions } from './item.query';
import { PartItem } from './item.types';

// Query hooks
export const useItemList = (param: Partial<PartItem>) => useQuery(queryOptions.itemList(param));

export const useItemDetail = (uid: number) => useQuery(queryOptions.itemDetail(uid));

export const useRelationItemList = (itemNo: string) => useQuery(queryOptions.relationItemList(itemNo));

export const useRelationStdItemSeqList = (stdItemSeq: string) => useQuery(queryOptions.relationStdItemSeqList(stdItemSeq));

export const useOrderNoItemList = (orderSeq: number) => useQuery(queryOptions.orderNoItemList(orderSeq));

export const useBomList = (stdItemSeq: string) => useQuery(queryOptions.bomList(stdItemSeq));

export const useItemRevision = (tdmxUid: string) => useQuery(queryOptions.revision(tdmxUid));

// Mutation hooks
export const useModifyItem = () => useMutation(mutateOptions.modifyItem());
export const useReviseItem = () => useMutation(mutateOptions.reviseItem());
