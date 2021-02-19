import { useState, useEffect } from 'react';

import { store, schema } from '../store/config';

type Schema = typeof schema;

interface IUseConfig {
  setConfig(key: string, value: any): void;
}

export function useConfig<Key extends keyof Schema>(
  key: Key,
): IUseConfig & Schema[Key]['default'] {
  const defaultValue = store.get(
    key,
    schema[key].default,
  ) as Schema[Key]['default'];
  const [value, setValue] = useState<Schema[Key]['default']>(defaultValue);

  useEffect(() => {
    const unsubscribe = store.onDidChange(key, newValue => {
      setValue(newValue as Schema[Key]['default']);
    });

    return unsubscribe;
  }, [key]);

  return {
    ...value,
    setConfig(configKey, newValue) {
      store.set(configKey, newValue);
    },
  };
}
