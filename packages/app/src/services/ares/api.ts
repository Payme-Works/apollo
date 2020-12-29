import axios, { AxiosInstance } from 'axios';

import { startedServer } from '@/utils/ares/startAresPythonServer';

let aresApi: AxiosInstance;

aresApi = axios.create({
  baseURL: `http://localhost:5000`,
});

function createAresApi() {
  if (aresApi) {
    return aresApi;
  }

  if (!startedServer.started) {
    return undefined;
  }

  aresApi = axios.create({
    baseURL: `http://localhost:${startedServer.port}`,
  });

  return aresApi;
}

export default createAresApi();
