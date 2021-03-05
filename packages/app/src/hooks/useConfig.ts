import { useEffect, useRef, MutableRefObject, useCallback } from 'react';

import { store, schema } from '../store/config';

type Schema = typeof schema;

interface IUseConfig {
  setConfig(key: string, value: any): void;
}

export function useConfig<Key extends keyof Schema>(
  key: Key,
  onChange?: (value: Schema[Key]['default']) => void,
): [MutableRefObject<Schema[Key]['default']>, IUseConfig] {
  const defaultValue = store.get(
    key,
    schema[key].default,
  ) as Schema[Key]['default'];

  const value = useRef<Schema[Key]['default']>(defaultValue);

  const setConfig = useCallback((configKey: string, newValue: any) => {
    store.set(configKey, newValue);
  }, []);

  useEffect(() => {
    const unsubscribe = store.onDidChange(key, newValue => {
      const castValue = newValue as Schema[Key]['default'];

      value.current = castValue;

      if (onChange) {
        onChange(castValue);
      }
    });

    return unsubscribe;
  }, [key, onChange]);

  return [
    value,
    {
      setConfig,
    },
  ];
}
