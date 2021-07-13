import axios from 'axios';
import HOST_NAME from '../../../config/config';
import { CardContent } from '../../../models/card-content';
import { Category } from '../../../models/category';

const RESPONCE_TIMEOUT = 2500;

const getCardsData = async (): Promise<
  Array<Array<CardContent | Category>>
> => {
  const source = axios.CancelToken.source();
  const timeout = setTimeout(() => {
    source.cancel();
  }, RESPONCE_TIMEOUT);
  try {
    const user = await axios.get(`${HOST_NAME}/cards-data`, {
      cancelToken: source.token,
    });
    clearTimeout(timeout);
    return user.data;
  } catch (err) {
    return [];
  }
};

export default getCardsData;
