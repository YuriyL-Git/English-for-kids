import axios, { AxiosResponse } from 'axios';
import HOST_NAME from '../../../config/config';

const removeCategory = async (
  category: string,
  user: string,
): Promise<AxiosResponse<string>> => {
  const res = await axios.post(
    `${HOST_NAME}/remove-category`,
    { category, user },
    {
      withCredentials: true,
    },
  );
  return res;
};

export default removeCategory;
