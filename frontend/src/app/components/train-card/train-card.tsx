import React, { ReactElement, useEffect, useState } from 'react';
import { CardContent } from '../../models/card-content';
import './_train-card.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import playSound from '../../helpers/play-sound';
import {
  cardClickedInPlayMode,
  cardClickedInTrainMode,
  removeBtnBlink,
  setBtnBlink,
} from '../../features/app-slice';
import HOST_NAME from '../../config/config';

const TrainCard = ({
  word,
  image,
  translation,
  audioSrc,
}: CardContent): ReactElement => {
  const dispatch = useAppDispatch();
  const [classRotate, setClassRotate] = useState('');
  const [classInactive, setClassInactive] = useState('');
  const playMode = useAppSelector(state => state.app.playMode);
  const gameIsStarted = useAppSelector(state => state.app.gameIsStarted);
  const gameSequence = useAppSelector(state => state.app.gameSequence);

  useEffect(
    () => () => {
      setClassInactive('');
    },
    [playMode],
  );

  const turnCard = (event: React.MouseEvent) => {
    event.stopPropagation();
    setClassRotate('train-card__card-on-back');
  };

  const turnCardBack = () => {
    setClassRotate('');
  };

  const onCardClick = () => {
    if (classInactive.length > 0) return;
    if (!playMode) {
      if (classRotate.length > 0) return;
      playSound(audioSrc);
      dispatch(cardClickedInTrainMode(word));
    } else {
      if (!gameIsStarted) {
        dispatch(setBtnBlink());
        setTimeout(() => {
          dispatch(removeBtnBlink());
        }, 1000);
        return;
      }
      dispatch(cardClickedInPlayMode(word));
      if (gameSequence[gameSequence.length - 1].word === word) {
        setClassInactive('card-inactive');
      }
    }
  };

  return (
    <div
      className="train-card__wrapper"
      onMouseLeave={turnCardBack}
      role="button"
      onClick={onCardClick}
      onKeyDown={() => {}}
    >
      <div className={`train-card ${classRotate}`}>
        <div className={`train-card__front-side ${classInactive}`}>
          <img
            className={`train-card__image ${playMode ? 'image-play' : ''}`}
            src={`${HOST_NAME}/${image}`}
            alt={`${image}`}
          />
          <div
            className={`train-card__title-wrapper ${playMode ? 'hidden' : ''}`}
          >
            <p className="train-card__title">{`${word}`}</p>
            <button
              className="train-card__btn"
              type="button"
              onClick={turnCard}
              onKeyDown={() => {}}
            >
              <img
                className="train-card__icon-rotate"
                src={`${HOST_NAME}/category-icon/circular-arrows.svg`}
                alt="icon-rotate"
              />
            </button>
          </div>
        </div>
        <div className="train-card__back-side">
          <img
            className="train-card__image"
            src={`${HOST_NAME}/${image}`}
            alt={`${image}`}
          />
          <div className="train-card__title-wrapper">
            <p className="train-card__title">{`${translation}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainCard;
