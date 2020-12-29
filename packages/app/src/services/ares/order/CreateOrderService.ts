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
  const expiration = getExpirationTime(data.expiration);

  try {
    const response = await aresApi.post<ICreateOrderAxiosResponse>('/orders', {
      ...data,
      expiration,
    });

    const { order_id } = response.data;

    const use = <R = any>(hook: UseOrderHook<R>): Promise<R> => {
      return hook({
        order_id,
        order: {
          data,
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
