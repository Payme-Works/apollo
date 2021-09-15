interface IStore {
  [key: string]: any;
}

const STORE: IStore = {};

export const Cache = {
  get<T = any>(key: string): T | undefined {
    return STORE[key];
  },
  set<T = any>(key: string, value: T | undefined | null): void {
    STORE[key] = value;
  },
};
