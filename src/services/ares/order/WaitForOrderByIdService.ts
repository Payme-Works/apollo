import aresApi from '@/services/ares/api';

export type Result = 'win' | 'loose' | 'equal';

export interface IWaitOrderByIdResponse {
  result: Result;
  profit: number;
}

export async function waitForOrderById(
  orderId: number,
): Promise<IWaitOrderByIdResponse> {
  try {
    const response = await aresApi.get<IWaitOrderByIdResponse>(
      `/orders/wait/${orderId}`,
    );

    console.log(`/orders/wait/${orderId}: `, JSON.stringify(response.data));

    return response.data;
  } catch (err) {
    throw new Error('Order was not found.');
  }
}
