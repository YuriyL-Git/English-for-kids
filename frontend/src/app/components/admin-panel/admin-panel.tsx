import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import './_admin-panel.scss';
import resetDb from '../../services/request/admin/reset-db';
import getCardsData from '../../services/request/user/get-cards-data';
import { resetStatistic, setCardsList } from '../../features/app-slice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

const AdminPanel = (): ReactElement => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.server.user);

  const onReset = () => {
    resetDb(user).then(() => {
      getCardsData().then(res => {
        dispatch(setCardsList(res));
        dispatch(resetStatistic());
      });
    });
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__links-wrapper">
        <Link to="/categories" className="admin-panel__link link-category">
          <div className="admin-panel__link-title">Categories</div>
        </Link>
        <button
          className="admin-panel__link btn-reset-db"
          type="button"
          onClick={onReset}
        >
          Reset database
        </button>
      </div>
      <Link to="/logout" className="admin-panel__link link-logout">
        <div>Logout</div>
      </Link>
    </div>
  );
};

export default AdminPanel;
