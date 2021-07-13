import axios, { AxiosResponse } from 'axios';
import HOST_NAME from '../../../config/config';
import { CardContent } from '../../../models/card-content';

const addWord = async (
  category: string,
  card: CardContent,
  user: string,
): Promise<AxiosResponse<string>> => {
  const res = await axios.post(
    `${HOST_NAME}/add-word`,
    { category, card, user },
    {
      withCredentials: true,
    },
  );
  return res;
};

export default addWord;
