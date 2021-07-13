import React, { ReactElement, useRef, useState } from 'react';
import './_add-word-card.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import getCardsData from '../../services/request/user/get-cards-data';
import { resetStatistic, setCardsList } from '../../features/app-slice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { CardContent } from '../../models/card-content';
import updateWordFiles from '../../services/request/admin/update-word-files';
import addWord from '../../services/request/admin/add-word';

const MSG_CONFIRM = 'Create new word?';
const MSG_NO_WORD = 'Please enter word';
const MSG_NO_TRANSLATION = 'Please enter translation';
const MSG_NO_IMG = 'Please load image';
const MSG_NO_SOUND = 'Please load sound';

const AddWordCard = ({ category }: AddWordProp): ReactElement => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.server.user);

  const [editMode, setEditMode] = useState(false);
  const [msgConfirm, setMsgConfirm] = useState('');

  const inputRefImage = useRef(null);
  const inputRefSound = useRef(null);

  const [imgName, setImgName] = useState('');
  const [imgPath, setImgPath] = useState('');
  const [soundName, setSoundName] = useState('');
  const [cardWord, setCardWord] = useState('');
  const [cardTranslation, setCardTranslation] = useState('');

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

  const onSoundClick = (): void => {
    chooseSoundFile();
  };

  const onImgClick = (): void => {
    if (!editMode) {
      return;
    }
    chooseImageFile();
  };

  const clearFields = () => {
    setEditMode(false);
    setCardWord('');
    setCardTranslation('');
    setImgName('');
    setImgPath('');
    setSoundName('');
    setData(new FormData());
    setMsgConfirm('');
  };

  const onCancel = (): void => {
    clearFields();
  };
  const onConfirm = (): void => {
    if (!cardWord) {
      setMsgConfirm(MSG_NO_WORD);
      return;
    }
    if (!cardTranslation) {
      setMsgConfirm(MSG_NO_TRANSLATION);
      return;
    }
    if (!imgName) {
      setMsgConfirm(MSG_NO_IMG);
      return;
    }
    if (!soundName) {
      setMsgConfirm(MSG_NO_SOUND);
      return;
    }
    const card: CardContent = {
      word: cardWord,
      image: imgName,
      translation: cardTranslation,
      audioSrc: `audio/${soundName}`,
    };
    data.append('user', user);
    updateWordFiles(data).then(() => {
      addWord(category, card, user).then(() => {
        updateView();
      });
      setData(new FormData());
      clearFields();
    });
  };

  const onEdit = (): void => {
    setEditMode(true);
    setMsgConfirm(MSG_CONFIRM);
  };

  return (
    <div className={`add-new-word ${editMode ? 'word-edit' : ''}`}>
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
      <div className={`add-new-word__edit-wrapper ${editMode ? '' : 'hidden'}`}>
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
        <div className="word-edit__sound" onClick={onSoundClick} role="button">
          <strong>Sound: </strong>
          {soundName}
        </div>
        <div className="add-new-word__img-wrapper">
          <strong>Image: </strong>
          <div
            className="add-new-word__img-container"
            role="button"
            onClick={onImgClick}
          >
            <img
              className={`add-new-word__img  ${imgPath ? '' : 'hidden'}`}
              src={`${imgPath}`}
              alt="img"
            />
          </div>
        </div>
      </div>
      <FontAwesomeIcon
        className={`add-new-word__plus-icon ${editMode ? 'hidden' : ''}`}
        icon={faPlus}
        onClick={onEdit}
      />

      <div className={`add-new-word__btn-wrapper ${editMode ? '' : 'hidden'}`}>
        <button
          className="category-edit__btn btn-red btn-add"
          type="button"
          onClick={onCancel}
        >
          CANCEL
        </button>
        <button
          className="category-edit__btn  btn-green btn-add"
          type="button"
          onClick={onConfirm}
        >
          OK
        </button>
      </div>
      <div className="add-new-word__msg">{msgConfirm}</div>
    </div>
  );
};

interface AddWordProp {
  category: string;
}

export default AddWordCard;
