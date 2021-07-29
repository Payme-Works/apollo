import IOrder from '@/interfaces/order/IOrder';
import aresApi from '@/services/ares/api';
import getExpirationTime from '@/utils/getExpirationTime';

import UseOrderHook from './hooks/UseOrderHook';

type IRequest = IOrder;

interface ICreateOrderAxiosResponse {
  order_id: number;
  open_quote: number;
  raw_event: {
    expiration_time: number;
  };
}

export interface ICreateOrderResponse extends ICreateOrderAxiosResponse {
  use<R = any>(hook: UseOrderHook<R>): Promise<R>;
}

export async function createOrder(
  data: IRequest,
): Promise<ICreateOrderResponse> {
  const orderData = data;

  orderData.active = orderData.active.replace('/', '');

  orderData.price_amount = Number(orderData.price_amount.toFixed(2));

  if (orderData.price_amount < 2) {
    orderData.price_amount = 2;
  }

  const expiration = getExpirationTime(orderData.expiration);

  try {
    const response = await aresApi.post<ICreateOrderAxiosResponse>('/orders', {
      ...orderData,
      expiration,
    });

    const { order_id } = response.data;

    const use = <R = any>(hook: UseOrderHook<R>): Promise<R> => {
      return hook({
        order_id,
        order: {
          data: orderData,
          response: {
            ...response.data,
            use,
          },
        },
      });
    };

    return {
      ...response.data,
      use,
    };
  } catch (err) {
    throw new Error(err.response.data.error);
  }
}
