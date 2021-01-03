import 'dotenv/config';

import {
  set as updateDate,
  startOfMinute,
  subSeconds,
  isAfter,
  isEqual,
  parseISO,
  subMinutes,
  isWithinInterval,
  addMinutes,
} from 'date-fns';
import path from 'path';

import IEvent from '@/interfaces/economic-calendar/IEvent';
import { InstrumentType } from '@/interfaces/order/IOrder';
import ISignal, { Expiration } from '@/interfaces/signal/ISignal';
import {
  createOrder,
  ICreateOrderResponse,
} from '@/services/ares/order/CreateOrderService';
import { useMartingaleStrategy } from '@/services/ares/order/hooks/strategies/MartingaleStrategy';
import Cache from '@/services/cache';
import koreApi from '@/services/kore/api';
import checkActionInFavorToTrend from '@/utils/checkActionInFavorToTrend';
import getActiveInfo from '@/utils/getActiveInfo';
import getRandomInt from '@/utils/getRandomInt';
import formatSignal from '@/utils/logging/formatSignal';
import parseSignalsFile from '@/utils/parseSignalsFile';

import { logIn } from './services/ares/account/LogInService';

const BALANCE_MODE = String(
  process.env.IQ_OPTION_ACCOUNT_BALANCE_MODE,
).toLowerCase();

const PRICE_AMOUNT = Number(process.env.PRICE_AMOUNT) || 2;
const MAX_MARTINGALE = Number(process.env.MAX_MARTINGALE) || 0;
const SKIP_SIGNAL_CHANCE_PERCENTAGE =
  Number(process.env.SKIP_SIGNAL_CHANCE_PERCENTAGE) || 0;
const SKIP_SIGNAL_CHANCE_PERCENTAGE_EXPIRATIONS =
  String(process.env.SKIP_SIGNAL_CHANCE_PERCENTAGE_EXPIRATIONS)?.split(',') ||
  [];
const FILTER_TREND = String(process.env.FILTER_TREND) === 'true';
const FILTER_TREND_EXPIRATIONS =
  String(process.env.FILTER_TREND_EXPIRATIONS)?.split(',') || [];
const DUPLICATE_NEXT_ORDER_IF_LOSS =
  String(process.env.DUPLICATE_NEXT_ORDER_IF_LOSS) === 'true';
const DUPLICATE_NEXT_ORDER_ONLY_TO_OTHER_EXPIRATION =
  String(process.env.DUPLICATE_NEXT_ORDER_ONLY_TO_OTHER_EXPIRATION) === 'true';
const STOP_GAIN = Number(process.env.STOP_GAIN) || 0;
const STOP_LOSS = Number(process.env.STOP_LOSS) * -1 ?? 0;

interface IDuplicateNextOrder {
  profit: number;
  ignore_expiration?: Expiration;
}

async function launch() {
  const signalsFilePath = path.resolve(__dirname, 'signals.txt');

  const date = updateDate(new Date(), {
    year: 2021,
    month: Number(process.env.MONTH) - 1,
    date: Number(process.env.DAY),
  });

  const parsedSignals = await parseSignalsFile(signalsFilePath, date);

  const blackListActives: string[] = [];
  let signalsInProgress: ISignal[] = [];

  let signals = parsedSignals
    .filter(signal => isAfter(signal.date, new Date()))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  signals.forEach(signal => {
    console.log(formatSignal(signal));
  });

  console.log(`\nTotal signals: ${signals.length}`);

  const statistics = {
    wins: 0,
    losses: 0,
    profit: 0,
  };

  function getNextSignals() {
    return signals
      .filter(signal => isAfter(signal.date, new Date()))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  }

  function printNextSignals() {
    if (signals.length === 0) {
      return;
    }

    const firstSignal = signals[0];

    signals
      .filter(
        signal =>
          signal.date.getTime() > Date.now() &&
          isEqual(signal.date, firstSignal.date),
      )
      .forEach(signal => {
        console.log(`Next signal: ${formatSignal(signal)}`);
      });

    console.log();
  }

  function printSkippedSignal(signal: ISignal, reason: string) {
    const formattedReason = reason ? `(reason: ${reason})` : '';

    console.log(
      `[${formatSignal(signal)}] Signal skipped ${formattedReason}`,
      '\n',
    );
  }

  function printStatistics() {
    console.log('Wins:', statistics.wins);
    console.log('Losses:', statistics.losses);
    console.log('Profit: R$', Number(statistics.profit.toFixed(2)));
    console.log('Remaining signals:', signals.length, '\n');
  }

  async function queueSignal(signal: ISignal) {
    signals = signals.filter(item => item.id !== signal.id);

    console.log(`Queued signal: ${formatSignal(signal)}`, '\n');

    printNextSignals();

    const randomInt = getRandomInt(1, 100);

    if (
      randomInt > 100 - SKIP_SIGNAL_CHANCE_PERCENTAGE &&
      SKIP_SIGNAL_CHANCE_PERCENTAGE_EXPIRATIONS.includes(
        signal.expiration.toLowerCase(),
      )
    ) {
      printSkippedSignal(signal, 'Randomly');
      return;
    }

    const activeInfo = await getActiveInfo(signal.active, signal.expiration);

    let type: InstrumentType = 'binary';

    let disputeProfit = true;

    if (!activeInfo.binary.open) {
      type = 'digital';
      disputeProfit = false;

      if (!activeInfo.digital.open) {
        printSkippedSignal(signal, 'Active is closed');
        return;
      }
    }

    let activeProfit = activeInfo[type].profit;

    if (disputeProfit && activeInfo.digital.profit > activeInfo.binary.profit) {
      type = 'digital';
      activeProfit = activeInfo.digital.profit;
    }

    if (activeProfit < 70) {
      printSkippedSignal(
        signal,
        `Active profit less than 70 [${activeProfit}]`,
      );

      return;
    }

    if (
      FILTER_TREND &&
      FILTER_TREND_EXPIRATIONS.includes(signal.expiration.toLowerCase())
    ) {
      const isActionInFavor = checkActionInFavorToTrend(
        signal.action,
        activeInfo[type].trend,
      );

      if (!isActionInFavor) {
        const info = {
          action: signal.action,
          trend: activeInfo[type].trend,
        };

        printSkippedSignal(
          signal,
          `Action against trend ${JSON.stringify(info)}`,
        );

        return;
      }
    }

    const { data: events } = await koreApi.get<IEvent[]>(
      '/economic-calendar/events',
    );

    const checkHasEvent = events
      .filter(event =>
        signal.active.toLowerCase().includes(event.economy.toLowerCase()),
      )
      .some(event => {
        const dateParsed = parseISO(event.date);

        const dateLessFifteenMinutes = subMinutes(signal.date, 30);
        const datePlusFifteenMinutes = addMinutes(signal.date, 30);

        return isWithinInterval(dateParsed, {
          start: dateLessFifteenMinutes,
          end: datePlusFifteenMinutes,
        });
      });

    if (checkHasEvent) {
      printSkippedSignal(
        signal,
        `Economic calendar event in interval of 30 minutes`,
      );

      return;
    }

    const now = new Date();
    const dateLessThreeSeconds = subSeconds(startOfMinute(signal.date), 3);

    const timeout = dateLessThreeSeconds.getTime() - now.getTime();

    setTimeout(async () => {
      if (blackListActives.includes(signal.active)) {
        printSkippedSignal(signal, 'Active is in black list');
        return;
      }

      if (signalsInProgress.length > 0) {
        printSkippedSignal(signal, 'Order already in progress');
        return;
      }

      signalsInProgress.push(signal);

      try {
        let duplicateLastLossPriceAmount = 0;
        const differencePercentage = activeProfit / 100;

        let duplicateNextOrder = Cache.get<IDuplicateNextOrder>(
          'duplicate-next-order',
        );

        if (
          DUPLICATE_NEXT_ORDER_IF_LOSS &&
          duplicateNextOrder &&
          (!duplicateNextOrder.ignore_expiration ||
            duplicateNextOrder.ignore_expiration !== signal.expiration)
        ) {
          const positiveLastProfit =
            duplicateNextOrder.profit < 0
              ? duplicateNextOrder.profit * -1
              : duplicateNextOrder.profit;

          duplicateLastLossPriceAmount = Number(
            positiveLastProfit / differencePercentage + PRICE_AMOUNT,
          );

          console.log();
          console.log('positiveLastProfit', positiveLastProfit);
          console.log(
            'duplicateLastLossPriceAmount',
            duplicateLastLossPriceAmount,
          );
          console.log('statistics.profit', statistics.profit);

          if (
            STOP_LOSS < 0 &&
            statistics.profit - duplicateLastLossPriceAmount <= STOP_LOSS
          ) {
            duplicateLastLossPriceAmount /= 1.5;
          }

          console.log();
          console.log(
            'duplicateLastLossPriceAmount',
            duplicateLastLossPriceAmount,
          );
          console.log();

          duplicateLastLossPriceAmount = Number(
            duplicateLastLossPriceAmount.toFixed(2),
          );

          console.log(
            `[${formatSignal(
              signal,
            )}] Duplicating order price, because previous order was lost: ${duplicateLastLossPriceAmount}`,
            '\n',
          );

          Cache.set<IDuplicateNextOrder>('duplicate-next-order', null);
        }

        const data = {
          type,
          active: signal.active,
          price_amount: duplicateLastLossPriceAmount || PRICE_AMOUNT,
          action: signal.action,
          expiration: signal.expiration,
        };

        let order: ICreateOrderResponse;

        try {
          order = await createOrder(data);
        } catch {
          signalsInProgress = signalsInProgress.filter(
            item => item.id !== signal.id,
          );
        }

        console.log(
          `[${formatSignal(signal)}] Order ID: ${
            order.order_id
          } (${JSON.stringify(data)})`,
          '\n',
        );

        let martingaleAmount = 0;

        const { result: finalResult, profit: finalProfit } = await order.use(
          useMartingaleStrategy(
            MAX_MARTINGALE,
            activeProfit,
            PRICE_AMOUNT,
            ({ profit, martingale, result, next }) => {
              console.log();
              console.log('martingale');
              console.log('statistics.profit', statistics.profit);
              console.log('profit', profit);
              console.log();

              if (
                STOP_LOSS < 0 &&
                statistics.profit - next.price_amount <= STOP_LOSS
              ) {
                let nextPriceAmount = next.price_amount / 1.5;

                nextPriceAmount = Number(nextPriceAmount.toFixed(2));

                next.setPriceAmount(nextPriceAmount);

                console.log(
                  `[${formatSignal(
                    signal,
                  )}] [${martingale}] Changing next order price amount to: R$ ${nextPriceAmount}`,
                  '\n',
                );
              }

              martingaleAmount = martingale + 1;

              if (martingale === 0) {
                console.log(
                  `[${formatSignal(signal)}] [${martingale}] Result: ${result}`,
                  '\n',
                );

                return;
              }

              console.log(
                `[${formatSignal(
                  signal,
                )}] [${martingale}] Martingale result: ${result}`,
                '\n',
              );
            },
          ),
        );

        console.log(
          `[${formatSignal(
            signal,
          )}] [${martingaleAmount}] Final result: ${finalResult} (R$ ${finalProfit.toFixed(
            2,
          )})`,
          '\n',
        );

        if (finalResult === 'win') {
          statistics.wins++;
        } else {
          statistics.losses++;

          blackListActives.push(signal.active);
        }

        signalsInProgress = signalsInProgress.filter(
          item => item.id !== signal.id,
        );

        duplicateNextOrder = Cache.get<IDuplicateNextOrder>(
          'duplicate-next-order',
        );

        if (finalProfit < 0) {
          const checkSomeNextSignalInAnotherExpiration = getNextSignals().some(
            nextSignal => nextSignal.expiration !== signal.expiration,
          );

          let profit = finalProfit;

          if (duplicateLastLossPriceAmount) {
            profit += duplicateLastLossPriceAmount;
          }

          Cache.set<IDuplicateNextOrder>('duplicate-next-order', {
            profit,
            ignore_expiration:
              checkSomeNextSignalInAnotherExpiration &&
              DUPLICATE_NEXT_ORDER_ONLY_TO_OTHER_EXPIRATION
                ? signal.expiration
                : undefined,
          });
        }

        statistics.profit += finalProfit;

        const balance = Cache.get<number>('balance') ?? 0;
        const newBalance = balance + finalProfit;

        Cache.set<number>('balance', newBalance);
      } catch (err) {
        console.log(`[${formatSignal(signal)}] Error: ${err}`, '\n');
      }

      printStatistics();
    }, timeout);
  }

  const profile = await logIn({
    email: String(process.env.IQ_OPTION_ACCOUNT_EMAIL),
    password: String(process.env.IQ_OPTION_ACCOUNT_PASSWORD),
    balance: BALANCE_MODE as any,
  });

  console.log();
  console.log(`E-mail: ${profile.email}`);
  console.log(`Balance: ${profile.balance.toFixed(2)}`);
  console.log(`Mode: ${BALANCE_MODE}`, '\n');

  Cache.set('initial-balance', profile.balance);
  Cache.set('balance', profile.balance);

  console.log(`Price amount: ${PRICE_AMOUNT}`);
  console.log(`Max martingale: ${MAX_MARTINGALE}`);
  console.log(
    `Skip signal chance percentage: ${SKIP_SIGNAL_CHANCE_PERCENTAGE}%`,
  );
  console.log(`Filter trend: ${FILTER_TREND}`);

  if (FILTER_TREND) {
    console.log(`Filter trend expirations: ${FILTER_TREND_EXPIRATIONS}`);
  }

  console.log(`Duplicate next order if loss: ${DUPLICATE_NEXT_ORDER_IF_LOSS}`);
  console.log(
    `Duplicate next order only to other expiration: ${DUPLICATE_NEXT_ORDER_ONLY_TO_OTHER_EXPIRATION}`,
  );
  console.log(`Stop gain: ${STOP_GAIN}`);
  console.log(`Stop loss: ${STOP_LOSS}`, '\n');

  printStatistics();

  printNextSignals();

  signals.forEach(signal => {
    const now = new Date();
    const dateLessThirtySeconds = subSeconds(startOfMinute(signal.date), 30);

    let timeout = dateLessThirtySeconds.getTime() - now.getTime();

    if (timeout < 0) {
      timeout = 0;
    }

    setTimeout(() => {
      if (STOP_GAIN > 0 && statistics.profit >= STOP_GAIN) {
        console.log('Stop gain hitted.');
        return;
      }

      if (STOP_LOSS < 0 && statistics.profit <= STOP_LOSS) {
        console.log('Stop loss hitted.');
        return;
      }

      queueSignal(signal);
    }, timeout);
  });
}

launch();
