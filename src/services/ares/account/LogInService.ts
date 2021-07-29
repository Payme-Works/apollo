import IProfile from '@/interfaces/account/IProfile';
import aresApi from '@/services/ares/api';

interface IRequest {
  email: string;
  password: string;
  balance: 'real' | 'practice';
}

interface IResponse {
  profile: IProfile;
  token: string;
}

export async function logIn(data: IRequest): Promise<IProfile> {
  const response = await aresApi.post<IResponse>('/sessions', data);

  const { profile, token } = response.data;

  aresApi.defaults.headers.authorization = `Bearer ${token}`;

  return profile;
}
