import { format, parseISO } from 'date-fns';

import ISignal from '@/interfaces/signal/ISignal';

export default function formatSignal(signal: ISignal): string {
  const expiration = signal.expiration.toUpperCase();
  const operation = signal.operation.toUpperCase();
  const formattedDate = format(parseISO(signal.date), 'dd/MM/yyyy HH:mm');

  return `${signal.currency} ${expiration} ${operation} ${formattedDate}`;
}
