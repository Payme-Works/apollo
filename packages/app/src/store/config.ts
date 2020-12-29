import Store from 'electron-store';
import { JSONSchemaType } from 'json-schema-typed';

const schema = {
  useMacOSWindowActionButtons: {
    type: JSONSchemaType.Boolean,
    default: false,
  },
  windowBounds: {
    type: JSONSchemaType.Object,
    default: {
      width: 616,
      height: 664,
    },
  },
};

const config = new Store({
  schema,
  watch: true,
});

export { schema, config };
