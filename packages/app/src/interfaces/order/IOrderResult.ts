import { Result } from '@/services/ares/order/WaitForOrderByIdService';

export default interface IOrderResult {
  result: Result;
  profit: number;
}
