import { useEffect, useRef, MutableRefObject } from 'react';

import { store, schema } from '../store/config';

type Schema = typeof schema;

interface IUseConfig {
  setConfig(key: string, value: any): void;
}

export function useConfig<Key extends keyof Schema>(
  key: Key,
): [MutableRefObject<Schema[Key]['default']>, IUseConfig] {
  const defaultValue = store.get(
    key,
    schema[key].default,
  ) as Schema[Key]['default'];

  const value = useRef<Schema[Key]['default']>(defaultValue);

  useEffect(() => {
    const unsubscribe = store.onDidChange(key, newValue => {
      value.current = newValue as Schema[Key]['default'];

      console.log((value.current as any).filters.randomSkipSignals);
    });

    return unsubscribe;
  }, [key]);

  return [
    value,
    {
      setConfig(configKey, newValue) {
        store.set(configKey, newValue);
      },
    },
  ];
}
