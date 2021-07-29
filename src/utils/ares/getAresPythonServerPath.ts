import fs from 'fs';
import path from 'path';

import aresConfig from '@/config/ares';

export function guessPackaged() {
  if (process.platform !== 'win32') {
    return false;
  }

  return fs.existsSync(aresConfig.distDirectory);
}

export default function getAresPythonServerPath() {
  if (!guessPackaged()) {
    return path.join(aresConfig.rootDirectory, `${aresConfig.mainFilename}.py`);
  }

  if (process.platform === 'win32') {
    return path.join(
      aresConfig.distDirectory,
      `${aresConfig.mainFilename}.exe`,
    );
  }

  return path.join(aresConfig.distDirectory, aresConfig.mainFilename);
}
