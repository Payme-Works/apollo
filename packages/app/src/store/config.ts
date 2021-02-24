import Store from 'electron-store';
import { JSONSchemaType } from 'json-schema-typed';

const schema = {
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
        martingale: {
          active: true,
          amount: 2,
        },
        stopGain: {
          selected: {
            value: 'real',
            label: 'R$',
          },
          value: 4,
        },
        stopLoss: {
          selected: {
            value: 'real',
            label: 'R$',
          },
          value: 8,
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
        parallelOrders: false,
        operationType: {
          value: 'all',
          label: 'Todos',
        },
        payout: {
          minimum: 70,
          maximum: 95,
        },
      },
      economicEvents: {
        filter: true,
        minutes: {
          before: 30,
          after: 30,
        },
      },
    },
  },
};

const store = new Store({
  schema,
  watch: true,
});

export { schema, store };
