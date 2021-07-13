import Axios from 'axios';
import HOST_NAME from '../../config/config';

const logoutUser = async (): Promise<boolean> => {
  try {
    await Axios.get(`${HOST_NAME}/logout`, {
      withCredentials: true,
    });
    return true;
  } catch (err) {
    return false;
  }
};

export default logoutUser;
