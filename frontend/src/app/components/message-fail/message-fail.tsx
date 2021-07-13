import React, { ReactElement, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import './_message-fail.scss';
import {
  setTimer,
  setTimerIsStarted,
  stopGame,
} from '../../features/app-slice';

const SHOW_MESSAGE_TIME = 5000;

const MessageFail = (): ReactElement => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const showFail = useAppSelector(state => state.app.showFailMessage);
  const timerIsStarted = useAppSelector(state => state.app.timerIsStarted);
  const currentGameAttempts = useAppSelector(
    state => state.app.currentGameAttempts,
  );
  const failedAttempts = currentGameAttempts.filter(
    att => att === false,
  ).length;

  useEffect(() => {
    if (showFail && !timerIsStarted) {
      const timer = setTimeout(() => {
        history.push('/');
      }, SHOW_MESSAGE_TIME);
      dispatch(setTimerIsStarted(true));
      dispatch(setTimer(timer));
    }
  }, [showFail]);

  const onMessageClick = (): void => {
    dispatch(stopGame());
    history.push('/');
  };

  return (
    <div
      onClick={onMessageClick}
      className={`message-fail__wrapper ${showFail ? '' : 'hidden'}`}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
    >
      <div className="message-fail__title">Fail</div>
      <div className="message-fail__error">
        You made {failedAttempts} mistakes
      </div>
      <img
        className="message-fail__image"
        src="./images/fail.png"
        alt="icon fail"
      />
    </div>
  );
};

export default MessageFail;
