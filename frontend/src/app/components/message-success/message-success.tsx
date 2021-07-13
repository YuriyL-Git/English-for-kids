import React, { ReactElement, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import './_message-success.scss';
import {
  setTimer,
  setTimerIsStarted,
  stopGame,
} from '../../features/app-slice';

const SHOW_MESSAGE_TIME = 5000;

const MessageSuccess = (): ReactElement => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const showSuccess = useAppSelector(state => state.app.showSuccessMessage);
  const timerIsStarted = useAppSelector(state => state.app.timerIsStarted);

  useEffect(() => {
    if (showSuccess && !timerIsStarted) {
      const timer = setTimeout(() => {
        history.push('/');
      }, SHOW_MESSAGE_TIME);
      dispatch(setTimerIsStarted(true));
      dispatch(setTimer(timer));
    }
  }, [showSuccess]);

  const onMessageClick = (): void => {
    dispatch(stopGame());
    history.push('/');
  };

  return (
    <div
      onClick={onMessageClick}
      className={`message-success__wrapper ${showSuccess ? '' : 'hidden'}`}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
    >
      <div className="message-success__title">Success !!!</div>
      <img
        className="message-success__image"
        src="./images/success.png"
        alt="icon success"
      />
    </div>
  );
};

export default MessageSuccess;
