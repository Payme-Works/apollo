import { format } from 'date-fns';

import ISignal from '@/interfaces/signal/ISignal';

export default function formatSignal(signal: ISignal): string {
  const expiration = signal.expiration.toUpperCase();
  const action = signal.action.toUpperCase();
  const formattedDate = format(signal.date, 'dd/MM/yyyy HH:mm');

  return `${signal.active} ${expiration} ${action} ${formattedDate}`;
}
