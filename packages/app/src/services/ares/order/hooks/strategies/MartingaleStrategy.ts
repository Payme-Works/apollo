import { subSeconds } from 'date-fns';

import IOrder from '@/interfaces/order/IOrder';
import IOrderResult from '@/interfaces/order/IOrderResult';
import { getLastRealtimeCandleOnActive } from '@/services/ares/active/candle/GetLastRealtimeCandleOnActiveService';
import { startRealtimeCandlesOnActive } from '@/services/ares/active/candle/StartRealtimeCandlesOnActiveService';
import { stopRealtimeCandlesOnActive } from '@/services/ares/active/candle/StopRealtimeCandlesOnActiveService';
import {
  createOrder,
  ICreateOrderResponse,
} from '@/services/ares/order/CreateOrderService';
import {
  Status,
  waitForOrderById,
  IWaitOrderByIdResponse,
} from '@/services/ares/order/WaitForOrderByIdService';
import getOrderResultByQuotes from '@/utils/getOrderResultByQuotes';

import UseOrderHook from '../UseOrderHook';

interface IOnLossAndCreateNextMartingaleOrderPayload {
  martingale: number;
  profit: number;
  result: Status;
  next: {
    price_amount: number;
    setPriceAmount(newPriceAmount: number): void;
  };
  cancel(): void;
}

interface ICreateMartingaleOrderPayload {
  order: ICreateOrderResponse;
}

export function useMartingaleStrategy(
  max: number,
  payout: number,
  priceAmount: number,
  onLossAndCreateNextMartingaleOrder?: (
    data: IOnLossAndCreateNextMartingaleOrderPayload,
  ) => void,
  onCreateMartingaleOrder?: (data: ICreateMartingaleOrderPayload) => void,
  _current = 0,
  _profit = 0,
): UseOrderHook<IOrderResult> {
  return ({ order_id, order }) =>
    new Promise(async (resolve, reject) => {
      try {
        let { expiration_time } = order.response.raw_event;

        if (String(expiration_time).length <= 10) {
          const fixedExpirationTime = `${String(expiration_time)}000`;

          expiration_time = Number(fixedExpirationTime);
        }

        let now = new Date();
        let expiration = subSeconds(new Date(expiration_time), 20);

        let timeout = expiration.getTime() - now.getTime();

        setTimeout(async () => {
          await startRealtimeCandlesOnActive({
            active: order.data.active,
            expiration: 'm1',
          });

          now = new Date();
          expiration = subSeconds(new Date(expiration_time), 1);

          timeout = expiration.getTime() - now.getTime();

          setTimeout(async () => {
            let result: Status = 'win';

            const lastRealtimeCandle = await getLastRealtimeCandleOnActive({
              active: order.data.active,
              expiration: 'm1',
            });

            let waitForOrder: IWaitOrderByIdResponse | null = null;

            let quotesDifference =
              order.response.open_quote - lastRealtimeCandle.close;

            if (quotesDifference < 0) {
              quotesDifference *= -1;
            }

            if (order.data.expiration !== 'm1' && quotesDifference > 0.0001) {
              result = getOrderResultByQuotes(order.data.action, {
                open: order.response.open_quote,
                close: lastRealtimeCandle.close,
              });
            } else {
              waitForOrder = await waitForOrderById(order_id);

              result = waitForOrder.status;
            }

            if (result === 'loose' && max > 0 && _current < max) {
              const { price_amount: lastOrderPriceAmount } = order.data;

              const differencePercentage = payout / 100;

              const calculatedPriceAmount =
                lastOrderPriceAmount / differencePercentage +
                lastOrderPriceAmount;

              let price_amount =
                calculatedPriceAmount || lastOrderPriceAmount * 2.25;

              let canceled = false;

              if (onLossAndCreateNextMartingaleOrder) {
                onLossAndCreateNextMartingaleOrder({
                  martingale: _current,
                  profit: -lastOrderPriceAmount,
                  result,
                  next: {
                    price_amount,
                    setPriceAmount(newPriceAmount: number) {
                      price_amount = newPriceAmount;
                    },
                  },
                  cancel() {
                    canceled = true;
                  },
                });
              }

              if (canceled) {
                if (!waitForOrder) {
                  waitForOrder = await waitForOrderById(order_id);
                }

                resolve({
                  status: result,
                  profit: _profit + waitForOrder.profit,
                });

                return;
              }

              const data: IOrder = {
                ...order.data,
                price_amount,
              };

              let martingaleOrder: ICreateOrderResponse;

              try {
                martingaleOrder = await createOrder(data);
              } catch (err) {
                reject(err);

                return;
              }

              if (onCreateMartingaleOrder) {
                onCreateMartingaleOrder({
                  order: martingaleOrder,
                });
              }

              if (!waitForOrder) {
                waitForOrder = await waitForOrderById(order_id);
              }

              const martingaleResult = martingaleOrder.use(
                useMartingaleStrategy(
                  max,
                  payout,
                  priceAmount,
                  onLossAndCreateNextMartingaleOrder,
                  onCreateMartingaleOrder,
                  _current + 1,
                  _profit + waitForOrder.profit,
                ),
              );

              resolve(martingaleResult);
            } else {
              stopRealtimeCandlesOnActive({
                active: order.data.active,
                expiration: 'm1',
              });

              if (!waitForOrder) {
                waitForOrder = await waitForOrderById(order_id);

                result = waitForOrder.status;
              }

              resolve({
                status: result,
                profit: _profit + waitForOrder.profit,
              });
            }
          }, timeout);
        }, timeout);
      } catch (err) {
        reject(err);
      }
    });
}
