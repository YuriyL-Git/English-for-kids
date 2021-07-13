import React, { ReactElement } from 'react';
import './_statistic-page.scss';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import TableRow from '../../components/table-row/table-row';
import { resetStatistic, sortByProperty } from '../../features/app-slice';
import { StatisticProperties } from '../../models/statistic-properties';

interface HeadType {
  title: string;
  property: StatisticProperties;
}

const TABLE_HEAD_ITEMS: Array<HeadType> = [
  { title: 'Word', property: 'word' },
  { title: 'Translation', property: 'translation' },
  { title: 'Category', property: 'category' },
  { title: 'Train clicks', property: 'trainingClicks' },
  { title: 'Correct answers', property: 'successCount' },
  { title: 'Error answers', property: 'errorsCount' },
  { title: 'Correct answers %', property: 'successRate' },
];

const StatisticPage = (): ReactElement => {
  const dispatch = useAppDispatch();

  const statisticData = useAppSelector(state => state.app.statistic);
  const sortType = useAppSelector(state => state.app.sortedUp);
  const sortFieldIndex = useAppSelector(
    state => state.app.categoryToSortByIndex,
  );

  const onResetStatistic = (): void => {
    dispatch(resetStatistic());
  };

  return (
    <div className="statistic">
      <div className="statistic__btn-wrapper">
        <Link to="repeat-words" className="repeat-link">
          <button type="button" className="statistic__btn">
            Repeat difficult words
          </button>
        </Link>
        <button
          type="button"
          className="statistic__btn btn-reset"
          onClick={onResetStatistic}
        >
          <img
            className="statistic__icon-reset"
            src="./icons/reset.svg"
            alt="icon reset"
          />
          Reset
        </button>
      </div>
      <div className="statistic__table">
        <div className="statistic__table-header">
          {TABLE_HEAD_ITEMS.map((headItem, index) => (
            <button
              key={headItem.title}
              className="statistic__category-btn"
              type="button"
              onClick={() => {
                dispatch(
                  sortByProperty({ category: headItem.property, index }),
                );
              }}
            >
              <div className="statistic__btn-content">
                {headItem.title}
                <img
                  className={`statistic__icon-arrow ${
                    sortFieldIndex === index ? '' : 'hidden'
                  } ${sortType ? '' : 'icon-down'}`}
                  src="./icons/arrow.svg"
                  alt="icon arrow"
                />
              </div>
            </button>
          ))}
        </div>
        {statisticData.map((statItem, index) => (
          <TableRow
            key={statItem.word + index}
            word={statItem.word}
            translation={statItem.translation}
            category={statItem.category}
            trainingClicks={statItem.trainingClicks}
            errorsCount={statItem.errorsCount}
            successCount={statItem.successCount}
            successRate={statItem.successRate}
          />
        ))}
      </div>
    </div>
  );
};

export default StatisticPage;
