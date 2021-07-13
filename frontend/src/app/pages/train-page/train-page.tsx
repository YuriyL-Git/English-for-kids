import React, { ReactElement } from 'react';
import { Category } from '../../models/category';
import { CardContent } from '../../models/card-content';
import TrainCard from '../../components/train-card/train-card';
import './_train-page.scss';
import Controls from '../../components/controls/controls';
import { useAppSelector } from '../../hooks/hooks';
import MessageSuccess from '../../components/message-success/message-success';
import MessageFail from '../../components/message-fail/message-fail';

const NO_WORDS_MSG = 'There are no words yet';

const TrainPage = ({ path }: TrainPageProps): ReactElement => {
  const cards = useAppSelector(state => state.app.cards);
  const menuOptions = cards[0] as unknown as Array<Category>;

  const starsList = useAppSelector(state => state.app.currentGameAttempts);
  const showFail = useAppSelector(state => state.app.showFailMessage);
  const showSuccess = useAppSelector(state => state.app.showSuccessMessage);
  const repeatWordsList = useAppSelector(state => state.app.repeatWordsList);

  const categoryIndex = menuOptions.findIndex(
    option => option.category.replace(/[\s()]/g, '').toLowerCase() === path,
  );
  let cardsList = cards[categoryIndex + 1] as unknown as Array<CardContent>;
  if (path === 'repeat-words') {
    cardsList = repeatWordsList;
  }

  return (
    <div className="train-page">
      <Controls />
      <MessageSuccess />
      <MessageFail />
      <div
        className={`cards-field__wrapper ${
          showFail || showSuccess ? 'hidden' : ''
        }`}
      >
        <div className="stars-section">
          {starsList.map((star, index) => (
            <img
              key={index}
              className="star-icon"
              src={`./icons/star-${star ? 'green' : 'red'}.svg`}
              alt="star-icon"
            />
          ))}
        </div>
        <div
          className={`no-cards-title ${cardsList.length > 0 ? 'hidden' : ''}`}
        >
          {NO_WORDS_MSG}
        </div>
        <div className="cards-field cards-field--train">
          {cardsList.map(card => (
            <TrainCard
              key={card.word}
              word={card.word}
              translation={card.translation}
              image={card.image}
              audioSrc={card.audioSrc}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface TrainPageProps {
  path: string;
}

export default TrainPage;
