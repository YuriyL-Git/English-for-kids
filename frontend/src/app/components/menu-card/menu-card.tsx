import React, { ReactElement } from 'react';
import './_menu-card.scss';
import { Link } from 'react-router-dom';
import { Category } from '../../models/category';

const MenuCard = ({ category, image }: Category): ReactElement => (
  <Link
    to={`${category.replace(/[\s()]/g, '').toLowerCase()}`}
    className="card__link"
    key={`${category}-link`}
  >
    <div className="card__wrapper">
      <img className="card__image" src={`${image}`} alt={`${category}`} />
      <div className="card__title-wrapper">
        <p className="card__title">{`${category}`}</p>
      </div>
    </div>
  </Link>
);

export default MenuCard;
