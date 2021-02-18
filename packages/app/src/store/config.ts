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
};

const store = new Store({
  schema,
  watch: true,
});

export { schema, store };
