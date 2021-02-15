import { Status } from '@/services/ares/order/WaitForOrderByIdService';

export default interface IOrderResult {
  status: Status;
  profit: number;
}
