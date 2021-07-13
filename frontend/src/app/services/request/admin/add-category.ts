import axios, { AxiosResponse } from 'axios';
import HOST_NAME from '../../../config/config';

const addCategory = async (data: FormData): Promise<AxiosResponse<string>> => {
  const res = await axios.post(`${HOST_NAME}/add-category`, data, {
    withCredentials: true,
  });
  return res;
};

export default addCategory;
