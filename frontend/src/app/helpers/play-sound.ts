import HOST_NAME from '../config/config';

const playSound = (src: string): void => {
  const audio = new Audio(`${HOST_NAME}/${src}`);
  audio.play().then();
};

export default playSound;
