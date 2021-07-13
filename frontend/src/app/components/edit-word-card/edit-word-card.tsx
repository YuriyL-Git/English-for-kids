import React, { ReactElement, useRef, useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardContent } from '../../models/card-content';
import './_edit-word-card.scss';
import getCardsData from '../../services/request/user/get-cards-data';
import { resetStatistic, setCardsList } from '../../features/app-slice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import HOST_NAME from '../../config/config';
import playSound from '../../helpers/play-sound';
import removeWord from '../../services/request/admin/remove-word';
import updateWordFiles from '../../services/request/admin/update-word-files';
import updateWord from '../../services/request/admin/update-word';

const EditWordCard = ({
  word,
  image,
  translation,
  audioSrc,
}: CardContent): ReactElement => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.server.user);

  const [editMode, setEditMode] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  const [cardWord, setCardWord] = useState(word);
  const [cardTranslation, setCardTranslation] = useState(translation);
  const [imgPath, setImgPath] = useState(`${HOST_NAME}/${image}`);
  const [imgName, setImgName] = useState(image);
  const [soundName, setSoundName] = useState(audioSrc.split('/').pop());
  const inputRefImage = useRef(null);
  const inputRefSound = useRef(null);

  const [data, setData] = useState<FormData>(new FormData());

  const updateView = (): void => {
    getCardsData().then(res => {
      dispatch(setCardsList(res));
      dispatch(resetStatistic());
    });
  };

  const chooseImageFile = (): void => {
    const { current } = inputRefImage;
    (
      current || {
        click: () => {},
      }
    ).click();
  };

  const chooseSoundFile = (): void => {
    const { current } = inputRefSound;
    (
      current || {
        click: () => {},
      }
    ).click();
  };

  const onRemove = (): void => {
    if (editMode) return;
    setRemoveMode(true);
  };

  const onSoundClick = (): void => {
    if (!editMode) {
      playSound(audioSrc);
      return;
    }
    chooseSoundFile();
  };

  const onImgClick = (): void => {
    if (!editMode) {
      return;
    }
    chooseImageFile();
  };

  const onUpdate = (): void => {
    setEditMode(true);
  };

  const onCancel = (): void => {
    setRemoveMode(false);
    setEditMode(false);
    setCardTranslation(translation);
    setCardWord(word);
    setImgPath(`${HOST_NAME}/${image}`);
    setSoundName(audioSrc.split('/').pop());
  };

  const onConfirm = (): void => {
    if (removeMode) {
      removeWord(word, translation, user).then(() => {
        updateView();
      });
    }

    if (!cardWord) {
      setCardWord(word);
    }
    if (!cardTranslation) {
      setCardTranslation(translation);
    }

    if (editMode) {
      updateWordFiles(data).then(() => {
        updateView();
        setData(new FormData());
      });
      const card: CardContent = {
        word: cardWord,
        image: imgName,
        translation: cardTranslation,
        audioSrc: `audio/${soundName}`,
      };
      updateWord(word, translation, card, user).then(() => {
        updateView();
      });
      setEditMode(false);
    }
  };

  return (
    <div className="word-edit">
      {/* load image input */}
      <input
        className="hidden"
        type="file"
        accept=".svg, .png, .jpg, .jpeg"
        onChange={e => {
          if (e.target.files) {
            if (!e.target.files) return;
            const file = e.target.files[0];
            const fileName = e.target.files[0].name;
            data.append('fileImg', file);
            data.append('imgName', fileName);
            setImgPath(URL.createObjectURL(file));
            setImgName(`img/${fileName}`);
          }
        }}
        ref={inputRefImage}
      />
      {/* load sound input */}
      <input
        className="hidden"
        type="file"
        accept=".mp3, .wav"
        onChange={e => {
          if (e.target.files) {
            if (!e.target.files) return;
            const file = e.target.files[0];
            const fileName = e.target.files[0].name;
            data.append('fileSound', file);
            data.append('soundName', fileName);
            setSoundName(fileName);
          }
        }}
        ref={inputRefSound}
      />
      <div
        className={`word-edit__remove-icon-wrapper ${
          editMode ? 'wrapper-edit' : ''
        }`}
      >
        <FontAwesomeIcon
          className="word-edit__remove-icon"
          icon={faTimes}
          onClick={onRemove}
        />
      </div>
      <div className={`word-edit__input-wrapper ${editMode ? '' : 'hidden'}`}>
        <input
          className="word-edit__input"
          placeholder="word"
          onChange={e => {
            setCardWord(e.target.value);
          }}
          value={cardWord}
        />
      </div>
      <div className={`word-edit__input-wrapper ${editMode ? '' : 'hidden'}`}>
        <input
          className="word-edit__input"
          placeholder="translation"
          onChange={e => {
            setCardTranslation(e.target.value);
          }}
          value={cardTranslation}
        />
      </div>
      <div className={`word-edit__word ${editMode ? 'hidden' : ''}`}>
        <strong>Word: </strong>
        {word}
      </div>
      <div className={`word-edit__translation ${editMode ? 'hidden' : ''}`}>
        <strong>Translation: </strong>
        {translation}
      </div>
      <div className="word-edit__sound" onClick={onSoundClick} role="button">
        <strong>Sound: </strong>
        {soundName}
      </div>
      <div className="word-edit__img-wrapper">
        <strong>Image: </strong>
        <img
          className={`word-edit__img ${editMode ? 'img-active' : ''}`}
          src={`${imgPath}`}
          alt="img"
          onClick={onImgClick}
        />
      </div>
      <div className="word-edit__btn-wrapper">
        <button
          className={`category-edit__btn ${
            editMode || removeMode ? 'hidden' : ''
          }`}
          type="button"
          onClick={onUpdate}
        >
          Edit card
        </button>
        <button
          className={`category-edit__btn edit-word-btn ${
            editMode || removeMode ? 'btn-red' : 'hidden'
          }`}
          type="button"
          onClick={onCancel}
        >
          CANCEL
        </button>
        <button
          className={`category-edit__btn edit-word-btn ${
            editMode || removeMode ? 'btn-green' : 'hidden'
          }`}
          type="button"
          onClick={onConfirm}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default EditWordCard;
