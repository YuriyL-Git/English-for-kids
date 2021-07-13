import React, { ReactElement, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Sidebar from './components/sidebar/sidebar';
import './style/App.scss';
import HomePage from './pages/home-page/home-page';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import {
  removeMenuActive,
  removeMenuFromTop,
  setMenuOnTop,
} from './features/menu-slice';

import { Category } from './models/category';
import TrainPage from './pages/train-page/train-page';
import routeHandler from './services/route-handler/route-handler';
import StatisticPage from './pages/statistic-page/statistic-page';
import LoginForm from './components/login-form/login-from';
import AdminPanel from './components/admin-panel/admin-panel';
import getLoggedInUser from './services/auth/get-logged-in-user';
import { loginAdmin } from './features/server-slice';
import EditCategoriesPage from './pages/edit-categories-page/edit-categories-page';
import getCardsData from './services/request/user/get-cards-data';
import {
  setCardsList,
  setHostMessage,
  setStatistic,
} from './features/app-slice';
import EditWordsPage from './pages/edit-words-page/edit-words-page';

function App(): ReactElement {
  const dispatch = useAppDispatch();
  const cards = useAppSelector(state => state.app.cards);
  const hostMessage = useAppSelector(state => state.app.hostMessage);
  const menuOptions = cards[0] as unknown as Array<Category>;
  const adminLoggedIn = useAppSelector(state => state.server.isAdminLoggedIn);
  const [appInitialized, setAppInitialized] = useState(false);

  routeHandler();

  if (!appInitialized) {
    getLoggedInUser().then(res => {
      if (res !== 'user_not_found' && res !== '') dispatch(loginAdmin());
    });
    getCardsData()
      .then(res => {
        dispatch(setCardsList(res));
        dispatch(setStatistic());

        setAppInitialized(true);
        if (res.length < 1) {
          dispatch(setHostMessage());
        }
      })
      .catch(() => dispatch(setHostMessage()));
  }

  const menuHover = () => {
    dispatch(setMenuOnTop());
  };

  const hideMenu = () => {
    dispatch(removeMenuActive());
    dispatch(removeMenuFromTop());
  };

  return (
    <div
      className="app"
      onClick={hideMenu}
      onKeyDown={() => {}}
      role="button"
      tabIndex={0}
    >
      <div className="menu-hover-box" onMouseEnter={menuHover} />
      <Sidebar />
      {adminLoggedIn ? <AdminPanel /> : ''}
      <h1 className="title">English for kids</h1>
      {hostMessage ? (
        <div className="title-hosting">
          Please restart application after 10-15 seconds. Backend is hosted on
          free hosting and requires some time to start.
        </div>
      ) : (
        ''
      )}
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        {menuOptions?.map(option => (
          <Route
            exact
            path={`/${option.category.replace(/[\s()]/g, '').toLowerCase()}`}
            key={option.category}
          >
            <TrainPage
              path={option.category.replace(/[\s()]/g, '').toLowerCase()}
            />
          </Route>
        ))}
        {/* edit words pages */}
        {adminLoggedIn
          ? menuOptions?.map(option => (
              <Route
                exact
                path={`/${option.category
                  .replace(/[\s()]/g, '')
                  .toLowerCase()}/words`}
                key={`${option.category}words`}
              >
                <EditWordsPage
                  category={option.category
                    .replace(/[\s()]/g, '')
                    .toLowerCase()}
                />
              </Route>
            ))
          : ''}
        <Route exact path="/repeat-words">
          <TrainPage path="repeat-words" />
        </Route>
        <Route exact path="/statistic">
          <StatisticPage />
        </Route>
        <Route exact path="/login">
          {adminLoggedIn ? <Redirect to="/" /> : <LoginForm />}
        </Route>
        <Route exact path="/categories">
          {adminLoggedIn ? <EditCategoriesPage /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/words">
          {adminLoggedIn ? <Redirect to="/categories" /> : <Redirect to="/" />}
        </Route>
        <Route path="/">
          <Redirect to="/" />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
