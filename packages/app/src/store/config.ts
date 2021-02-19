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
      mainAdjustments: {
        orderPrice: {
          selected: {
            value: 'real',
            label: 'R$',
          },
          value: 2,
        },
        operationType: {
          value: 'all',
          label: 'Todos',
        },
        martingale: true,
        martingaleAmount: 2,
      },
    },
  },
};

const store = new Store({
  schema,
  watch: true,
});

export { schema, store };
