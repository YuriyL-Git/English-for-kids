import React, { ReactElement } from 'react';
import './_home-page.scss';
import MenuCard from '../../components/menu-card/menu-card';
import { Category } from '../../models/category';
import { useAppSelector } from '../../hooks/hooks';
import HOST_NAME from '../../config/config';

const HomePage = (): ReactElement => {
  const cards = useAppSelector(state => state.app.cards);
  const menuOptions = cards[0] as unknown as Array<Category>;

  return (
    <section>
      <div className="categories-title">Categories:</div>
      <div className="cards-field">
        {menuOptions?.map((option, index) =>
          cards[index + 1][0] ? (
            <MenuCard
              category={`${option.category}`}
              key={`${option.category}`}
              image={`${HOST_NAME}/${cards[index + 1][0].image}`}
            />
          ) : (
            ''
          ),
        )}
      </div>
    </section>
  );
};

export default HomePage;
