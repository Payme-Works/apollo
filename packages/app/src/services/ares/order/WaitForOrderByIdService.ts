import aresApi from '@/services/ares/api';

export type Status = 'win' | 'loose' | 'equal';

export interface IWaitOrderByIdResponse {
  status: Status;
  profit: number;
}

export async function waitForOrderById(
  orderId: number,
): Promise<IWaitOrderByIdResponse> {
  try {
    const response = await aresApi.get<IWaitOrderByIdResponse>(
      `/orders/wait/${orderId}`,
    );

    return response.data;
  } catch (err) {
    throw new Error('Order was not found.');
  }
}
