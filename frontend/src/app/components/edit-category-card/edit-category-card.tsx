import React, { ReactElement, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './_edit-category-card.scss';
import { useHistory } from 'react-router-dom';
import HOST_NAME from '../../config/config';
import { Category } from '../../models/category';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { resetStatistic, setCardsList } from '../../features/app-slice';
import getCardsData from '../../services/request/user/get-cards-data';
import updateIconCategory from '../../services/request/admin/update-icon-category';
import updateCategoryName from '../../services/request/admin/update-category-name';
import removeCategory from '../../services/request/admin/remove-category';

const REMOVE_MESSAGE = 'Remove category?';
const UPDATE_MESSAGE = 'Update category name?';

const EditCategoryCard = ({ category, image }: Category): ReactElement => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.server.user);

  const [removeMode, setRemoveMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(category);

  const [msgConfirm, setMsgConfirm] = useState('');
  const inputRef = useRef(null);
  const history = useHistory();

  const chooseFile = (): void => {
    const { current } = inputRef;
    (
      current || {
        click: () => {},
      }
    ).click();
  };

  const updateView = (): void => {
    getCardsData().then(res => {
      dispatch(setCardsList(res));
      dispatch(resetStatistic());
    });
  };

  const onRemove = (): void => {
    if (editMode) return;
    setRemoveMode(true);
    setMsgConfirm(REMOVE_MESSAGE);
  };

  const onConfirm = (): void => {
    if (!removeMode && !editMode) {
      const path = `/${category.replace(/[\s()]/g, '').toLowerCase()}/words`;
      history.push(path);
      return;
    }
    if (removeMode) {
      removeCategory(category, user).then(() => {
        updateView();
      });
      setRemoveMode(false);
    }
    if (editMode && newCategoryName.length > 0) {
      updateCategoryName(category, newCategoryName, user).then(() => {
        updateView();
      });
    }
    setMsgConfirm('');
    setEditMode(false);
    setRemoveMode(false);
    setNewCategoryName(category);
  };
  const onCancel = (): void => {
    if (editMode || removeMode) {
      setEditMode(false);
      setRemoveMode(false);
      setMsgConfirm('');
      return;
    }
    setEditMode(true);
    setMsgConfirm(UPDATE_MESSAGE);
    setNewCategoryName(category);
  };

  return (
    <div className="category-edit">
      <input
        className="hidden"
        type="file"
        accept=".svg, .ico, .png"
        onChange={e => {
          if (e.target.files) {
            if (!e.target.files) return;
            const file = e.target.files[0];
            const fileName = e.target.files[0].name;
            const data = new FormData();
            data.append('file', file);
            data.append('fileName', fileName);
            data.append('category', category);
            data.append('user', user);
            updateIconCategory(data).then(() => {
              updateView();
            });
          }
        }}
        ref={inputRef}
      />
      <div className="category-edit__remove-icon-wrapper">
        <FontAwesomeIcon
          className="category-edit__remove-icon"
          icon={faTimes}
          onClick={onRemove}
        />
      </div>
      <div className="category-edit__title-wrapper">
        <div className={`category-edit__title ${editMode ? 'hidden' : ''}`}>
          {category}
        </div>
        <input
          className={`category-edit__title-input ${editMode ? '' : 'hidden'}`}
          type="text"
          placeholder="category"
          value={newCategoryName}
          onChange={e => {
            setNewCategoryName(e.target.value);
          }}
        />
      </div>
      <div
        className="category-edit__icon-wrapper"
        role="button"
        onClick={chooseFile}
      >
        <div className="category-edit__icon-title">Icon:</div>
        <img
          className="category-edit__icon"
          src={`${HOST_NAME}/category-icon/${image}`}
          alt="icon"
        />
      </div>
      <div className="category-edit__btn-wrapper">
        <button
          className={`category-edit__btn ${
            editMode || removeMode ? 'btn-red' : ''
          }`}
          type="button"
          onClick={onCancel}
        >
          {editMode || removeMode ? 'CANCEL' : 'Edit name'}
        </button>
        <button
          className={`category-edit__btn ${
            editMode || removeMode ? 'btn-green' : ''
          }`}
          type="button"
          onClick={onConfirm}
        >
          {editMode || removeMode ? 'OK' : 'Edit words'}
        </button>
      </div>
      <div className="category-edit__msg">{msgConfirm}</div>
    </div>
  );
};

export default EditCategoryCard;
