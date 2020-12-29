import IOrder from '@/interfaces/order/IOrder';
import { ICreateOrderResponse } from '@/services/ares/order/CreateOrderService';

export interface IOrderHookRequest {
  order_id: number;
  order: {
    data: IOrder;
    response: ICreateOrderResponse;
  };
}

type UseOrderHook<R = any> = (data: IOrderHookRequest) => Promise<R>;

export default UseOrderHook;
