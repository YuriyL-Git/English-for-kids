import { StatisticItem } from '../models/statistic-item';
import { CardContent } from '../models/card-content';
import { Category } from '../models/category';

const getStatisticList = (
  cards: Array<Array<CardContent | Category>>,
): Array<StatisticItem> => {
  // check local storage first
  const listFromStorage = JSON.parse(
    <string>localStorage.getItem('statistic'),
  ) as Array<StatisticItem>;
  if (listFromStorage) {
    return listFromStorage;
  }

  // if local storage not contains list, generate empty list
  const statisticList: Array<StatisticItem> = [];
  const categories = cards[0] as Array<Category>;

  for (let i = 1; i < cards.length; i++) {
    for (let j = 0; j < cards[i].length; j++) {
      const card = cards[i][j] as CardContent;

      const item: StatisticItem = {
        word: card.word,
        translation: card.translation,
        category: categories[i - 1].category,
        errorsCount: 0,
        successCount: 0,
        successRate: -1,
        trainingClicks: 0,
      };
      statisticList.push(item);
    }
  }
  return statisticList;
};

export default getStatisticList;
