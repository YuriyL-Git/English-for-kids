import axios, { AxiosResponse } from 'axios';
import HOST_NAME from '../../../config/config';

const updateWordFiles = async (
  data: FormData,
): Promise<AxiosResponse<string>> => {
  const res = await axios.put(`${HOST_NAME}/update-word-files`, data, {
    withCredentials: true,
  });
  return res;
};

export default updateWordFiles;
