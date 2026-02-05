import { CommonFile } from 'api/file/file.types';
import { ChangeOrder, ChangeOrderBlobPayload } from './changeOrder.types';
import changeOrderService from './changeOrderService';

type queryKeyNames = 'changeOrderList' | 'changeOrderDetail' | 'changeOrderDrawHelper';

type mutateKeyNames = 'saveChangeOrder' | 'removeAttachedFile';

export const queryKeys: Record<queryKeyNames, any> = {
  changeOrderList: (param: Partial<ChangeOrder>) => ['change-order', 'list', param] as const,
  changeOrderDetail: (coUid: number) => ['change-order', 'detail', coUid] as const,
  changeOrderDrawHelper: (coUid: number, projectUid: number) => ['change-order', 'draw', 'helper', coUid, projectUid] as const
};

export const queryOptions = {
  changeOrderList: (param: Partial<ChangeOrder>) => ({
    queryKey: queryKeys.changeOrderList(param),
    queryFn: () => changeOrderService.getChangeOrderList(param)
  }),
  changeOrderDetail: (coUid: number) => ({
    queryKey: queryKeys.changeOrderDetail(coUid),
    queryFn: () => changeOrderService.getChangeOrder(coUid),
    enabled: !!coUid && coUid > 0
  }),
  changeOrderDrawHelper: (projectUid: number, coUid?: number) => ({
    queryKey: queryKeys.changeOrderDrawHelper(coUid, projectUid),
    queryFn: () => changeOrderService.getChangeOrderDrawHelper(projectUid, coUid),
    enabled: !!projectUid && projectUid > 0
  })
};

export const mutateKeys: Record<mutateKeyNames, any> = {
  saveChangeOrder: ['saveChangeOrder'] as const,
  removeAttachedFile: ['removeAttachedFile'] as const
};

export const mutateOptions = {
  saveChangeOrder: {
    mutationFn: (payload: ChangeOrderBlobPayload) => changeOrderService.save(payload)
  },
  removeAttachedFile: {
    mutationFn: ({ coUid, file }: { coUid: number; file: CommonFile }) => changeOrderService.removeAttachedFile(coUid, file)
  }
};
