import React, { ReactElement } from 'react';
import './_controls.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
  createGameSequence,
  startGame,
  toggleTrainMode,
} from '../../features/app-slice';
import playSound from '../../helpers/play-sound';

const Controls = (): ReactElement => {
  const dispatch = useAppDispatch();
  const playMode = useAppSelector(state => state.app.playMode);
  const gameIsStarted = useAppSelector(state => state.app.gameIsStarted);
  const gameSequence = useAppSelector(state => state.app.gameSequence);
  const btnBlink = useAppSelector(state => state.app.btnBlink);

  const onSwitchToggle = () => {
    dispatch(toggleTrainMode());
  };

  const onStartGame = () => {
    if (!gameIsStarted) {
      dispatch(createGameSequence());
      dispatch(startGame());
    } else if (gameSequence.length > 0)
      playSound(gameSequence[gameSequence.length - 1].audioSrc);
  };

  return (
    <div className="switch-wrapper">
      <button
        type="button"
        className={`btn-start-game ${btnBlink} ${
          playMode ? '' : 'btn-hidden'
        } ${gameIsStarted ? 'btn-repeat' : ''}`}
        onClick={onStartGame}
      >
        {gameIsStarted ? '' : 'START GAME'}
        <img
          src="./icons/repeat.svg"
          alt="icon-repeat"
          className={`icon-repeat ${gameIsStarted ? '' : 'hidden'}`}
        />
      </button>
      <div className="onoffswitch">
        <input
          type="checkbox"
          name="onoffswitch"
          className="onoffswitch-checkbox"
          id="myonoffswitch"
          tabIndex={0}
          defaultChecked={playMode}
          onClick={onSwitchToggle}
        />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="onoffswitch-label" htmlFor="myonoffswitch">
          <span className="onoffswitch-inner" />
          <span className="onoffswitch-switch" />
        </label>
      </div>
    </div>
  );
};

export default Controls;
