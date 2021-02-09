import axios from 'axios';
import os from 'os';

import getTimeZone from '@/utils/getTimeZone';

const koreApi = axios.create({
  baseURL: 'https://api.paymetrade.com',
});

koreApi.defaults.headers['X-Apollo-Electron'] = os.userInfo().username;
koreApi.defaults.headers['X-Admin-Token'] = process.env.KORE_ADMIN_TOKEN_SECRET;
koreApi.defaults.headers['User-TimeZone'] = getTimeZone();

export default koreApi;
