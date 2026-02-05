import { SalesOrder } from './salesOrder.types';
import salesOrderService from './salesOrderService';

type queryKeyNames = 'salesOrders' | 'salesOrder';

// type mutationKeyNames = 'createSalesOrder' | 'updateSalesOrder' | 'deleteSalesOrder';

export const queryKeys: Record<queryKeyNames, any> = {
  salesOrders: (params?: any) => ['sales', 'orders', 'list', ...(params ? [params] : [])],
  salesOrder: (id: string) => ['sales', 'order', 'detail', id]
};

// export const mutationKeys: Record<mutationKeyNames, any> = {};

export const queryOptions = {
  salesOrders: (params: Partial<SalesOrder>) => ({
    queryKey: queryKeys.salesOrders(params),
    queryFn: () => salesOrderService.getSalesOrders(params)
  })
};
