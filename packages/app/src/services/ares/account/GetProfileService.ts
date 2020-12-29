import IProfile from '@/interfaces/account/IProfile';
import aresApi from '@/services/ares/api';

type IResponse = IProfile;

export async function getProfile(): Promise<IProfile> {
  const response = await aresApi.get<IResponse>('/profile');

  return response.data;
}
