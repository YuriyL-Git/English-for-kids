import axios, { AxiosResponse } from 'axios';
import HOST_NAME from '../../../config/config';

const updateCategoryName = async (
  oldCategoryName: string,
  newCategoryName: string,
  user: string,
): Promise<AxiosResponse<string>> => {
  const res = await axios.put(
    `${HOST_NAME}/update-category-name`,
    { oldCategoryName, newCategoryName, user },
    {
      withCredentials: true,
    },
  );
  return res;
};

export default updateCategoryName;
