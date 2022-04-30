import { UpdateSignalData } from '@/context/SignalsContext';
import { Signal } from '@/interfaces/signals/Signal';

interface SignalTaskErrorData extends UpdateSignalData {
  signal: Signal;
}

export class SignalTaskError {
  public signal: Signal;

  public update: UpdateSignalData;

  constructor({ signal, ...update }: SignalTaskErrorData) {
    this.signal = signal;
    this.update = update;
  }
}
