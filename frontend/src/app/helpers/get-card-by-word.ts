import { CardContent } from '../models/card-content';
import { Category } from '../models/category';

const getCardByWord = (
  cards: Array<Array<CardContent | Category>>,
  word: string,
  translation: string,
): CardContent | null => {
  for (let i = 1; i < cards.length; i++) {
    for (let j = 0; j < cards[i].length; j++) {
      const card = cards[i][j] as unknown as CardContent;
      if (card.word === word && card.translation === translation) return card;
    }
  }
  return null;
};

export default getCardByWord;
