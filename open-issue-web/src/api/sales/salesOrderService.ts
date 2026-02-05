import ServiceBase from 'api/ServiceBase';
import { SalesOrder } from './salesOrder.types';

class SalesOrderService extends ServiceBase {
  getSalesOrders(params?: Partial<SalesOrder>) {
    return this.service.get<SalesOrder[]>('salesOrder', { params });
  }
}

export default new SalesOrderService();
