import path from 'path';

interface IAresConfig {
  rootDirectory: string;
  distDirectory: string;

  virtualEnvPath: {
    python3: string;
    activate: string;
  };

  mainFilename: string;
}

const rootDirectory = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  '..',
  '..',
  'packages',
  'ares',
);

export default {
  rootDirectory,
  distDirectory: path.resolve(rootDirectory, 'dist'),

  virtualEnvPath: {
    python3: path.resolve(rootDirectory, 'env', 'bin', 'python3'),
    activate: path.resolve(rootDirectory, 'env', 'bin', 'activate'),
  },

  mainFilename: 'main',
} as IAresConfig;
