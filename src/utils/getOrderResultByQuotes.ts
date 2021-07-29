import { Action } from '@/interfaces/signal/ISignal';
import { Result } from '@/services/ares/order/WaitForOrderByIdService';

interface IQuotes {
  open: number;
  close: number;
}

export default function getOrderResultByQuotes(
  action: Action,
  quotes: IQuotes,
): Result {
  const { open, close } = quotes;

  if (close === open) {
    return 'equal';
  }

  if (action === 'call' && close > open) {
    return 'win';
  }

  if (action === 'put' && close < open) {
    return 'win';
  }

  return 'loose';
}
