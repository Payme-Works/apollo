import { Signal } from '@/interfaces/signals/Signal';
import { Status } from '@/interfaces/signals/SignalWithStatus';

interface SignalTaskErrorData {
  signal: Signal;
  status: Status;
  info?: string;
}

export class SignalTaskError {
  public signal: Signal;

  public status: Status;

  public info?: string;

  constructor({ signal, status, info }: SignalTaskErrorData) {
    this.signal = signal;
    this.status = status;
    this.info = info;
  }
}
