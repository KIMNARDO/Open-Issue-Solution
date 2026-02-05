import { useMutation, useQuery } from '@tanstack/react-query';
import { mutateOptions, queryOptions } from './changeOrder.query';
import { ChangeOrder } from './changeOrder.types';

// Query hooks
export const useChangeOrderList = (param: Partial<ChangeOrder>) => useQuery(queryOptions.changeOrderList(param));

export const useChangeOrderDetail = (coUid: number) => useQuery(queryOptions.changeOrderDetail(coUid));

export const useChangeOrderDrawHelper = (projectUid: number, coUid?: number) =>
  useQuery(queryOptions.changeOrderDrawHelper(projectUid, coUid));

// Mutation hooks
export const useSaveChangeOrder = () => useMutation(mutateOptions.saveChangeOrder);

export const useRemoveAttachedFile = () => useMutation(mutateOptions.removeAttachedFile);
