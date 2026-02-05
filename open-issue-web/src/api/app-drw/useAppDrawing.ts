import { useMutation, useQuery } from '@tanstack/react-query';
import { mutationOptions, queryOptions } from './appDrawing.queries';
import { AppDrawing } from './drawing.types';

export const useAppDrawingListByPjtUid = (pjtUid: number) => useQuery(queryOptions.appDrawingListByPjtUid(pjtUid));
export const useAppDrawingDetail = (appDrawUid: number) => useQuery(queryOptions.appDrawingDetail(appDrawUid));
export const useAppDrawingListTree = () => useQuery(queryOptions.appDrawingListTree());
export const useAppDrawingList = (param: Partial<AppDrawing>) => useQuery(queryOptions.appDrawingList(param));
export const useAppDrawingWorkOrder = (appDrawUid: number) => useQuery(queryOptions.appDrawingWorkOrder(appDrawUid));
export const useAppDrawingWorkOrderHelper = (projectUid: number, appDrawUid?: number) =>
  useQuery({
    ...queryOptions.appDrawingWorkOrderHelper(projectUid, appDrawUid),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: false
  });
export const useAppDrawingRevisionHistory = (appDrawUid: number) => useQuery(queryOptions.appDrawingRevisionHistory(appDrawUid));
export const useAppDrawingByOrderUid = (orderUid: number) => useQuery(queryOptions.appDrawingByOrderUid(orderUid));
export const useAppDrawingChangeOrderList = (appDrawUid: number) => useQuery(queryOptions.appDrawingChangeOrderList(appDrawUid));

export const useModifyAppDrawing = () => useMutation(mutationOptions.modifyAppDrawing());
export const useBatchPjtAppDrwManager = () => useMutation(mutationOptions.batchPjtAppDrwManager());
export const useBatchPjtAppDrwTdSubmittedDate = () => useMutation(mutationOptions.batchPjtAppDrwTdSubmittedDate());
export const useRegistAppDrawing = () => useMutation(mutationOptions.registAppDrawing());
export const useRemoveAppDrwFile = () => useMutation(mutationOptions.removeAppDrwFile());
export const useReviseAppDrawing = () => useMutation(mutationOptions.reviseAppDrawing());
