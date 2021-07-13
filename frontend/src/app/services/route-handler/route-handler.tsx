import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
  setCurrentCategory,
  setDifficultWordsArray,
  stopGame,
  stopTimer,
} from '../../features/app-slice';
import { setSelectedItemIndex } from '../../features/menu-slice';
import getCategoryIndex from '../../helpers/get-category-index';
// import cards from '../../cards-data/cards';
import { Category } from '../../models/category';
import { logoutAdmin } from '../../features/server-slice';

export default function routeHandler(): void {
  const cards = useAppSelector(state => state.app.cards);
  const menuOptions = cards[0] as unknown as Array<Category>;

  const dispatch = useAppDispatch();
  const location = useLocation();
  const history = useHistory();

  React.useEffect(() => {
    const path = location.pathname.substring(1);
    dispatch(setCurrentCategory(path));
    dispatch(setDifficultWordsArray());
    dispatch(stopGame());
    dispatch(stopTimer());

    if (path.length === 0) {
      dispatch(setSelectedItemIndex(0));
      return;
    }
    if (path === 'statistic') {
      dispatch(setSelectedItemIndex(menuOptions?.length + 2));
      return;
    }
    if (path === 'login') {
      if (menuOptions?.length > 0)
        dispatch(setSelectedItemIndex(menuOptions.length + 3));
      return;
    }
    if (path === 'logout') {
      dispatch(logoutAdmin());
      history.push('/');
      return;
    }
    if (path === 'repeat-words') {
      dispatch(setSelectedItemIndex(-1));
      return;
    }
    const categoryIndex = getCategoryIndex(path, cards);
    dispatch(setSelectedItemIndex(categoryIndex + 1));
  });
}
