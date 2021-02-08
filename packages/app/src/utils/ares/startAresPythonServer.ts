import childProcess from 'child_process';
import fs from 'fs';
import { merge } from 'lodash';

import aresConfig from '@/config/ares';
import getRandomInt from '@/utils/getRandomInt';

import getAresPythonServerPath, {
  guessPackaged,
} from './getAresPythonServerPath';

interface IServer {
  started: boolean;
  port: number;
  process: any;
}

export const startedServer = {
  started: false,
} as IServer;

export default async function startAresPythonServer(): Promise<IServer> {
  if (startedServer.started) {
    return startedServer;
  }

  const server = await new Promise<IServer>(resolve => {
    const port = getRandomInt(1000, 9999);

    console.log('Starting ares server on port:', port);

    const pythonScriptPath = getAresPythonServerPath();

    let pythonProcess = null;

    if (guessPackaged()) {
      pythonProcess = childProcess.execFile(pythonScriptPath);
    } else {
      let pythonCommand = aresConfig.virtualEnvPath.python3;

      if (!fs.existsSync(pythonCommand)) {
        pythonCommand = 'python3';
      }

      pythonProcess = childProcess.spawn(pythonCommand, [
        pythonScriptPath,
        `--port`,
        String(port),
      ]);
    }

    pythonProcess.stdout.on('data', data => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', data => {
      console.log(`stderr: ${data}`);

      if (data.includes('Running')) {
        const newServer: IServer = {
          started: true,
          process: pythonProcess,
          port,
        };

        resolve(newServer);
      }
    });

    pythonProcess.on('close', (code: number) => {
      console.log(`Child process exited with code ${code}.`);
    });
  });

  merge(startedServer, server);

  return server;
}
