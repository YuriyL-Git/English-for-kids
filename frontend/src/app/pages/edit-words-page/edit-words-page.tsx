import React, { ReactElement } from 'react';
import './_edit-words.scss';
import { useAppSelector } from '../../hooks/hooks';
import { Category } from '../../models/category';
import { CardContent } from '../../models/card-content';
import EditWordCard from '../../components/edit-word-card/edit-word-card';
import AddWordCard from '../../components/add-word-card/add-word-card';

const EditWordsPage = ({ category }: EditPageProps): ReactElement => {
  const cards = useAppSelector(state => state.app.cards);
  const menuOptions = cards[0] as unknown as Array<Category>;
  const categoryIndex = menuOptions.findIndex(
    option => option.category.replace(/[\s()]/g, '').toLowerCase() === category,
  );
  const cardsList = cards[categoryIndex + 1] as unknown as Array<CardContent>;

  return (
    <div className="edit-words-page">
      <div className="edit-category-page__title">
        Edit words: <b> {menuOptions[categoryIndex].category}</b>
      </div>
      <div className="cards-field">
        <AddWordCard category={menuOptions[categoryIndex].category} />
        {cardsList?.map((option, index) => (
          <EditWordCard
            key={option.word}
            word={option.word}
            translation={option.translation}
            image={option.image}
            audioSrc={option.audioSrc}
          />
        ))}
      </div>
    </div>
  );
};

interface EditPageProps {
  category: string;
}

export default EditWordsPage;
