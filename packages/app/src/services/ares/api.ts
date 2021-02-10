import axios, { AxiosInstance } from 'axios';

import { aresPythonServerStatus } from '@/utils/ares/startAresPythonServer';

let aresApi: AxiosInstance;

// aresApi = axios.create({
//   baseURL: `http://localhost:5000`,
// });

function createAresApi() {
  if (aresApi) {
    return aresApi;
  }

  if (!aresPythonServerStatus.started) {
    return undefined;
  }

  aresApi = axios.create({
    baseURL: `http://localhost:${aresPythonServerStatus.port}`,
  });

  return aresApi;
}

export default createAresApi();
