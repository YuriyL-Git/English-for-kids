import axios, { AxiosResponse } from 'axios';
import HOST_NAME from '../../../config/config';

const removeWord = async (
  word: string,
  translation: string,
  user: string,
): Promise<AxiosResponse<string>> => {
  const res = await axios.post(
    `${HOST_NAME}/remove-word`,
    { word, translation, user },
    {
      withCredentials: true,
    },
  );
  return res;
};

export default removeWord;
