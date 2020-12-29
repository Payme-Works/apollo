import { parse } from 'date-fns';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

import ISignal, { Action, Expiration } from '@/interfaces/signal/ISignal';

export default async function parseSignalsFile(
  filePath: string,
  date: Date,
): Promise<ISignal[]> {
  const checkFileExists = fs.existsSync(filePath);

  if (!checkFileExists) {
    throw new Error('It was not able to find signals file.');
  }

  return new Promise((resolve, reject) => {
    let isOtc = false;

    if (
      (date.getDay() === 0 && date.getHours() < 22) ||
      date.getDay() === 6 ||
      (date.getDay() === 5 && date.getHours() >= 15)
    ) {
      isOtc = false;
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }

      const lines = data.split('\n');

      const signals = lines
        .filter(line => line.length > 0)
        .map<ISignal>(line => {
          const values = line.trim().replace(/ {2}/g, ' ').split(';');

          const expiration = values[0];
          let active = values[1];
          const parsedDate = parse(values[2], 'HH:mm:ss', date);
          const action = values[3];

          if (isOtc && !active.includes('-OTC')) {
            active += '-OTC';
          }

          return {
            id: uuid(),
            active,
            date: parsedDate,
            action: String(action).toLowerCase() as Action,
            expiration: String(expiration).toLowerCase() as Expiration,
          };
        });

      resolve(signals);
    });
  });
}
