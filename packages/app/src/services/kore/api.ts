import axios from 'axios';

const koreApi = axios.create({
  baseURL: 'https://api.paymetrade.com',
});

export default koreApi;
