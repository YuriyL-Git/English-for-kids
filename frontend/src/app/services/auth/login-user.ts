import axios from 'axios';
import HOST_NAME from '../../config/config';

const loginUser = async (
  username: string,
  password: string,
): Promise<boolean> => {
  try {
    const res = await axios.post(
      `${HOST_NAME}/login`,
      {
        username,
        password,
      },
      {
        withCredentials: true,
      },
    );
    return res.data === 'success';
  } catch (err) {
    return false;
  }
};

export default loginUser;
