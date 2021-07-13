import axios, { AxiosResponse } from 'axios';
import HOST_NAME from '../../../config/config';

const resetDb = async (user: string): Promise<AxiosResponse<string>> => {
  const res = await axios.post(
    `${HOST_NAME}/reset-db`,
    { reset: 'resetDb', user },
    {
      withCredentials: true,
    },
  );
  return res;
};

export default resetDb;
