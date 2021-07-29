interface IExpirations {
  [key: string]: number;
}

const EXPIRATIONS: IExpirations = {
  M1: 1,
  M5: 5,
  M15: 15,
  M30: 30,
  H1: 60,
};

export default function getExpirationTime(expiration: string): number {
  return EXPIRATIONS[expiration.toUpperCase()];
}
