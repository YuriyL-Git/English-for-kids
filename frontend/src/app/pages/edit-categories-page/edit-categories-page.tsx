import React, { ReactElement, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './_edit-categories-page.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { Category } from '../../models/category';
import EditCategoryCard from '../../components/edit-category-card/edit-category-card';
import getCardsData from '../../services/request/user/get-cards-data';
import { resetStatistic, setCardsList } from '../../features/app-slice';
import addCategory from '../../services/request/admin/add-category';

const MSG_CONFIRM = 'Create new category?';

const EditCategoriesPage = (): ReactElement => {
  const cards = useAppSelector(state => state.app.cards);
  const user = useAppSelector(state => state.server.user);
  const categories = cards[0] as Array<Category>;
  const dispatch = useAppDispatch();

  const [isEditMode, setIsEditMode] = useState(false);
  const [img, setImg] = useState<string>('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [msgConfirm, setMsgConfirm] = useState('');
  const [newCategoryData, setNewCategoryData] = useState<FormData | null>(null);
  const inputRef = useRef(null);

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
      setTimeout(() => {
        dispatch(resetStatistic());
      }, 3000);
    });
  };

  const onCancel = (): void => {
    setIsEditMode(false);
    setNewCategoryName('');
    setImg('');
    setMsgConfirm('');
  };

  const onConfirm = (): void => {
    if (newCategoryName.length === 0) {
      setMsgConfirm('Enter category name');
      return;
    }
    if (newCategoryData) {
      const index = categories.findIndex(
        cat => cat.category === newCategoryName,
      );
      if (index > -1) {
        setMsgConfirm('Category already exists!');
        return;
      }
      newCategoryData.append('category', newCategoryName);
      addCategory(newCategoryData).then(() => {
        updateView();
      });
    } else {
      setMsgConfirm('Set category icon!');
      return;
    }
    setIsEditMode(false);
    setNewCategoryName('');
    setImg('');
    setMsgConfirm('');
  };

  const onEdit = (): void => {
    setIsEditMode(true);
    setMsgConfirm(MSG_CONFIRM);
  };

  return (
    <div className="edit-category-page">
      <div className="edit-category-page__title">Edit categories</div>
      <div className="cards-field">
        <div className={`add-new-category ${isEditMode ? 'card-edit' : ''}`}>
          <input
            className="hidden"
            type="file"
            accept=".svg, .ico, .png"
            onChange={e => {
              if (e.target.files) {
                if (!e.target.files) return;
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = ev => {
                  const image = document.createElement('img');
                  if (ev.target) setImg(ev.target.result as string);
                  document.body.appendChild(image);
                };
                reader.readAsDataURL(file);

                const fileName = e.target.files[0].name;
                const data = new FormData();
                data.append('file', file);
                data.append('fileName', fileName);
                data.append('user', user);
                setNewCategoryData(data);
              }
            }}
            ref={inputRef}
          />
          <input
            type="text"
            className={`add-new-category__input ${isEditMode ? '' : 'hidden'}`}
            placeholder="category name"
            onChange={event => {
              setNewCategoryName(event.target.value);
            }}
            value={newCategoryName}
          />
          <div
            className={`add-new-category__icon-wrapper ${
              isEditMode ? '' : 'hidden'
            }`}
            role="button"
            onClick={chooseFile}
          >
            <div className="category-edit__icon-title">Icon:</div>
            <img
              className={`add-new-category__icon ${img ? '' : 'hidden'}`}
              src={img}
              alt="img"
            />
          </div>
          <FontAwesomeIcon
            className={`add-new-category__plus-icon ${
              isEditMode ? 'hidden' : ''
            }`}
            icon={faPlus}
            onClick={onEdit}
          />

          <div
            className={`category-edit__btn-wrapper ${
              isEditMode ? '' : 'hidden'
            }`}
          >
            <button
              className="category-edit__btn btn-red"
              type="button"
              onClick={onCancel}
            >
              CANCEL
            </button>
            <button
              className="category-edit__btn  btn-green"
              type="button"
              onClick={onConfirm}
            >
              OK
            </button>
          </div>
          <div className="category-edit__msg">{msgConfirm}</div>
        </div>
        {categories?.map((option, index) => (
          <EditCategoryCard
            key={option.category}
            category={option.category}
            image={option.image}
          />
        ))}
      </div>
    </div>
  );
};

export default EditCategoriesPage;
