import Store from 'electron-store';
import { JSONSchemaType } from 'json-schema-typed';

export const schema = {
  window: {
    type: JSONSchemaType.Object,
    default: {
      useMacOSWindowActionButtons: false,
      windowBounds: {
        width: 616,
        height: 664,
      },
    },
  },
  robot: {
    type: JSONSchemaType.Object,
    default: {
      management: {
        orderPrice: {
          selected: {
            value: 'real',
            label: 'R$',
          },
          value: 2,
        },
        recoverLostOrder: true,
        martingale: {
          active: true,
          amount: 6,
        },
        stopGain: {
          selected: {
            value: 'real',
            label: 'R$',
          },
          value: 10,
        },
        stopLoss: {
          selected: {
            value: 'real',
            label: 'R$',
          },
          value: 100,
        },
      },
      filters: {
        expirations: [
          {
            value: 'm5',
            label: 'M5',
          },
          {
            value: 'm15',
            label: 'M15',
          },
          {
            value: 'm30',
            label: 'M30',
          },
          {
            value: 'h1',
            label: 'H1',
          },
        ],
        instrumentType: {
          value: 'all',
          label: 'Todos',
        },
        payout: {
          minimum: 75,
          maximum: 100,
        },
        filterTrend: false,
        parallelOrders: false,
        randomSkipSignals: {
          active: false,
          chancePercentage: 75,
        },
      },
      economicEvents: {
        filter: true,
        minutes: {
          before: 15,
          after: 15,
        },
      },
      application: {
        timezone: {
          value: 'America/Sao_Paulo',
          label: 'Brasil, São Paulo',
        },
        theme: {
          value: 'dark',
          label: 'Escuro',
        },
        notifications: true,
        updates: true,
      },
    },
  },
};

export const store = new Store({
  schema,
  watch: true,
});
