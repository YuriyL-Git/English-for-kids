import React, { ReactElement } from 'react';
import './_sidebar.scss';
import { Link } from 'react-router-dom';
import { Category } from '../../models/category';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
  removeMenuActive,
  removeMenuFromTop,
  setMenuActive,
} from '../../features/menu-slice';
import HOST_NAME from '../../config/config';

const Sidebar = (): ReactElement => {
  const dispatch = useAppDispatch();
  const cards = useAppSelector(state => state.app.cards);
  const menuOptions = cards[0] as unknown as Array<Category>;

  const menuOnTopClass = useAppSelector(state => state.menu.menuOnTopClass);
  const menuActive = useAppSelector(state => state.menu.menuActiveClass);
  const selectedIndex = useAppSelector(state => state.menu.selectedItemIndex);
  const adminIsLoggedIn = useAppSelector(state => state.server.isAdminLoggedIn);

  const toggleMenu = (event: React.MouseEvent): void => {
    event.stopPropagation();
    if (menuActive.length === 0) {
      dispatch(setMenuActive());
    } else {
      dispatch(removeMenuActive());
      dispatch(removeMenuFromTop());
    }
  };

  const menuFromTop = (): void => {
    if (!menuActive) {
      dispatch(removeMenuFromTop());
    }
  };

  return (
    <div className={`sidebar ${menuOnTopClass}`}>
      <div className={`menu-wrapper ${menuActive}`}>
        <div className="menu">
          <div className="options">
            <Link to="/" className="menu-link">
              <div
                className={`option option--home ${
                  selectedIndex === 0 ? 'selected' : ''
                }`}
                key="main page"
                onClick={() => {
                  dispatch(removeMenuActive());
                  dispatch(removeMenuFromTop());
                }}
                onKeyDown={() => {}}
                role="button"
                tabIndex={0}
                aria-label="Menu"
              >
                Home page
              </div>
            </Link>
            {menuOptions?.map((option, index) => (
              <Link
                to={`/${option.category.replace(/[\s()]/g, '').toLowerCase()}`}
                className="menu-link"
                key={`${option.category}-link`}
              >
                <div
                  className={`option ${
                    selectedIndex === index + 1 ? 'selected' : ''
                  }`}
                  key={option.category}
                  onClick={() => {
                    dispatch(removeMenuActive());
                    dispatch(removeMenuFromTop());
                  }}
                  onKeyDown={() => {}}
                  role="button"
                  tabIndex={0}
                  aria-label="Menu"
                >
                  <img
                    className="category-icon"
                    src={`${HOST_NAME}/category-icon/${option.image}`}
                    alt="icon"
                  />
                  {option.category}
                </div>
              </Link>
            ))}

            <Link to="/statistic" className="menu-link">
              <div
                className={`option option--statistic ${
                  selectedIndex === menuOptions?.length + 2 ? 'selected' : ''
                }`}
                key="statistic"
                onClick={() => {
                  dispatch(removeMenuActive());
                  dispatch(removeMenuFromTop());
                }}
                onKeyDown={() => {}}
                role="button"
                tabIndex={0}
                aria-label="Menu"
              >
                <img
                  className="icon-statistic"
                  src="./icons/bar-chart.svg"
                  alt="icon"
                />
                Statistic
              </div>
            </Link>
            <Link
              to={`${adminIsLoggedIn ? '/logout' : '/login'}`}
              className="menu-link"
            >
              <div
                className={`option ${
                  selectedIndex === menuOptions?.length + 3 ? 'selected' : ''
                }`}
              >
                {`${adminIsLoggedIn ? 'Logout' : 'Login'}`}
              </div>
            </Link>
          </div>
        </div>
        <div className="round-corners" />
        <svg
          className="x"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 220 400"
          height="400"
          width="220"
        >
          <g className="top-bars" strokeWidth="8" fill="orange">
            <path
              className="bar-top bar-top--x"
              d="M 152,17 H 202"
              fill="none"
              strokeLinecap="round"
            />
            <path
              className="bar-bottom bar-bottom--x"
              strokeLinecap="round"
              d="M 152,32 H 202"
            />
          </g>
        </svg>
      </div>
      <div
        role="button"
        aria-label="Menu"
        className="menu-click-area"
        onClick={toggleMenu}
        onMouseLeave={menuFromTop}
        tabIndex={0}
        onKeyDown={() => {}}
      />
    </div>
  );
};

export default Sidebar;
