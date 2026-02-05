import { useQuery } from '@tanstack/react-query';
import { queryOptions } from './salesOrder.query';

export const useSalesOrders = (params?: any) => {
  return useQuery(queryOptions.salesOrders(params));
};
