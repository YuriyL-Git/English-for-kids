import React, { ReactElement } from 'react';
import { StatisticItem } from '../../models/statistic-item';
import './_table-row.scss';

const TableRow = ({
  word,
  successCount,
  errorsCount,
  successRate,
  trainingClicks,
  translation,
  category,
}: StatisticItem): ReactElement => {
  const answers = successCount + errorsCount;
  return (
    <div className="table-row">
      <div className="table__row-content">{word}</div>
      <div className="table__row-content">{translation}</div>
      <div className="table__row-content">{category}</div>
      <div className="table__row-content">{trainingClicks}</div>
      <div className="table__row-content">{successCount}</div>
      <div className="table__row-content">{errorsCount}</div>
      <div className="table__row-content">
        {answers > 0 ? `${successRate}%` : '-'}
      </div>
    </div>
  );
};

export default TableRow;
