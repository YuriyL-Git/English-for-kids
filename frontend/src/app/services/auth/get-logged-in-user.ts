import axios from 'axios';
import HOST_NAME from '../../config/config';

const getLoggedInUser = async (): Promise<string> => {
  try {
    const user = await axios.get(`${HOST_NAME}/user`, {
      withCredentials: true,
    });
    return user.data;
  } catch (err) {
    return 'user_not_found';
  }
};

export default getLoggedInUser;
