import axios, { AxiosResponse } from 'axios';
import HOST_NAME from '../../../config/config';
import { CardContent } from '../../../models/card-content';

const updateWord = async (
  origWord: string,
  origTranslation: string,
  card: CardContent,
  user: string,
): Promise<AxiosResponse<string>> => {
  const res = await axios.put(
    `${HOST_NAME}/update-word`,
    { origWord, origTranslation, card, user },
    {
      withCredentials: true,
    },
  );
  return res;
};

export default updateWord;
