import { Rectangle } from 'electron';

import { config, schema } from '../../src/store/config';

export const getWindowBounds = (): Rectangle => {
  const { width, height, x, y } = config.get('windowBounds') as Rectangle;

  return {
    width: width || schema.windowBounds.default.width,
    height: height || schema.windowBounds.default.height,
    x,
    y,
  };
};

export const setWindowBounds = (bounds: Rectangle | undefined): void => {
  if (!bounds) {
    return;
  }
  const { width, height, x, y } = bounds;

  config.set('windowBounds', {
    width: width || schema.windowBounds.default.width,
    height: height || schema.windowBounds.default.height,
    x,
    y,
  });
};
