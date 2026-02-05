import { CommonFile } from 'api/file/file.types';
import appDrawingService from './appDrawingService';
import { AppDrawing, AppDrawingBlobPayload, AppDrwBatchPayload } from './drawing.types';

type queryKeyNames =
  | 'appDrawingListByPjtUid'
  | 'appDrawingDetail'
  | 'appDrawingList'
  | 'appDrawingListTree'
  | 'appDrawingWorkOrder'
  | 'appDrawingWorkOrderHelper'
  | 'appDrawingRevisionHistory'
  | 'appDrawingByOrderUid'
  | 'appDrawingChangeOrderList';
type mutationKeyNames =
  | 'modifyAppDrawing'
  | 'batchPjtAppDrwManager'
  | 'batchPjtAppDrwTdSubmittedDate'
  | 'registAppDrawing'
  | 'removeAppDrwFile'
  | 'reviseAppDrawing';

export const queryKeys: Record<queryKeyNames, any> = {
  appDrawingListByPjtUid: (pjtUid: number) => ['app-drawing', 'list', 'project', pjtUid] as const,
  appDrawingDetail: (appDrawUid: number) => ['app-drawing', 'detail', appDrawUid] as const,
  appDrawingList: (param: Partial<AppDrawing>) => ['app-drawing', 'list', 'all', param] as const,
  appDrawingListTree: () => ['app-drawing', 'list', 'tree'] as const,
  appDrawingWorkOrder: (appDrawUid: number) => ['app-drawing', 'work-order', appDrawUid] as const,
  appDrawingWorkOrderHelper: (appDrawUid: number, projectUid: number) =>
    ['app-drawing', 'work-order', 'helper', appDrawUid, projectUid] as const,
  appDrawingRevisionHistory: (appDrawUid: number) => ['app-drawing', 'revision-history', appDrawUid] as const,
  appDrawingByOrderUid: (orderUid: number) => ['app-drawing', 'work-order', 'appDraw', orderUid] as const,
  appDrawingChangeOrderList: (appDrawUid: number) => ['app-drawing', 'change-order', 'list', appDrawUid] as const
};

export const mutationKeys: Record<mutationKeyNames, any> = {
  modifyAppDrawing: () => ['app-drawing', 'modify'] as const,
  batchPjtAppDrwManager: () => ['app-drawing', 'batchPjtAppDrwManager'] as const,
  batchPjtAppDrwTdSubmittedDate: () => ['app-drawing', 'batchPjtAppDrwTdSubmittedDate'] as const,
  registAppDrawing: () => ['app-drawing', 'regist'] as const,
  removeAppDrwFile: () => ['app-drawing', 'removeAppDrwFile'] as const,
  reviseAppDrawing: () => ['app-drawing', 'reviseAppDrawing'] as const
};

export const queryOptions = {
  appDrawingListByPjtUid: (pjtUid: number) => ({
    queryKey: queryKeys.appDrawingListByPjtUid(pjtUid),
    queryFn: () => appDrawingService.getAppDrawingListByPjtUid(pjtUid),
    enabled: !!pjtUid && pjtUid > 0
  }),
  appDrawingDetail: (appDrawUid: number) => ({
    queryKey: queryKeys.appDrawingDetail(appDrawUid),
    queryFn: () => appDrawingService.getAppDrawingDetail(appDrawUid),
    enabled: !!appDrawUid && appDrawUid > 0
  }),
  appDrawingListTree: () => ({
    queryKey: queryKeys.appDrawingList(),
    queryFn: () => appDrawingService.getAppDrawingListTree()
  }),
  appDrawingList: (param: Partial<AppDrawing>) => ({
    queryKey: queryKeys.appDrawingList(param),
    queryFn: () => appDrawingService.getAppDrawingList(param)
  }),
  appDrawingWorkOrder: (appDrawUid: number) => ({
    queryKey: queryKeys.appDrawingWorkOrder(appDrawUid),
    queryFn: () => appDrawingService.getAppDrawingWorkOrder(appDrawUid),
    enabled: !!appDrawUid && appDrawUid > 0
  }),
  appDrawingWorkOrderHelper: (projectUid: number, appDrawUid?: number) => ({
    queryKey: queryKeys.appDrawingWorkOrderHelper(projectUid, appDrawUid),
    queryFn: () => appDrawingService.getAppDrawingWorkOrderHelper(projectUid, appDrawUid),
    enabled: !!projectUid && projectUid > 0
  }),
  appDrawingRevisionHistory: (appDrawUid: number) => ({
    queryKey: queryKeys.appDrawingRevisionHistory(appDrawUid),
    queryFn: () => appDrawingService.getAppDrawingRevisionHistory(appDrawUid),
    enabled: !!appDrawUid && appDrawUid > 0
  }),
  appDrawingByOrderUid: (orderUid: number) => ({
    queryKey: queryKeys.appDrawingByOrderUid(orderUid),
    queryFn: () => appDrawingService.getAppDrawingByOrderUid(orderUid),
    enabled: !!orderUid && orderUid > 0
  }),
  appDrawingChangeOrderList: (appDrawUid: number) => ({
    queryKey: queryKeys.appDrawingChangeOrderList(appDrawUid),
    queryFn: () => appDrawingService.getAppDrawingChangeOrderList(appDrawUid),
    enabled: !!appDrawUid && appDrawUid > 0
  })
};

export const mutationOptions = {
  modifyAppDrawing: () => ({
    mutationKey: mutationKeys.modifyAppDrawing(),
    mutationFn: (payload: AppDrawingBlobPayload) => appDrawingService.modifyAppDrawing(payload)
  }),
  batchPjtAppDrwManager: () => ({
    mutationKey: mutationKeys.batchPjtAppDrwManager(),
    mutationFn: (payload: AppDrwBatchPayload) => appDrawingService.batchPjtAppDrwManager(payload)
  }),
  batchPjtAppDrwTdSubmittedDate: () => ({
    mutationKey: mutationKeys.batchPjtAppDrwTdSubmittedDate(),
    mutationFn: (payload: AppDrwBatchPayload) => appDrawingService.batchPjtAppDrwTdSubmittedDate(payload)
  }),
  registAppDrawing: () => ({
    mutationKey: mutationKeys.registAppDrawing(),
    mutationFn: (payload: AppDrawingBlobPayload) => appDrawingService.registAppDrawing(payload)
  }),
  removeAppDrwFile: () => ({
    mutationKey: mutationKeys.removeAppDrwFile(),
    mutationFn: (payload: { appDrawUid: number; file: CommonFile }) => appDrawingService.removeAppDrwFile(payload.appDrawUid, payload.file)
  }),
  reviseAppDrawing: () => ({
    mutationKey: mutationKeys.reviseAppDrawing(),
    mutationFn: (appDrawUid: number) => appDrawingService.reviseAppDrawing(appDrawUid)
  })
};
