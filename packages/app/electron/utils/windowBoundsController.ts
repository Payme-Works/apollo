import { Rectangle } from 'electron';

import { store, schema } from '../../src/store/config';

export const getWindowBounds = (): Rectangle => {
  const { width, height, x, y } = store.get('window.windowBounds') as Rectangle;

  return {
    width: width || schema.window.default.windowBounds.width,
    height: height || schema.window.default.windowBounds.height,
    x,
    y,
  };
};

export const setWindowBounds = (bounds: Rectangle | undefined): void => {
  if (!bounds) {
    return;
  }
  const { width, height, x, y } = bounds;

  store.set('window.windowBounds', {
    width: width || schema.window.default.windowBounds.width,
    height: height || schema.window.default.windowBounds.height,
    x,
    y,
  });
};
