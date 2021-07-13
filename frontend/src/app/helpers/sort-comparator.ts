import { StatisticItem } from '../models/statistic-item';
import { StatisticProperties } from '../models/statistic-properties';

const compareByPropUp =
  (property: StatisticProperties) =>
  (a: StatisticItem, b: StatisticItem): number => {
    if (a[property] > b[property]) {
      return 1;
    }
    if (a[property] < b[property]) {
      return -1;
    }
    return 0;
  };

const compareByPropDown =
  (property: StatisticProperties) =>
  (a: StatisticItem, b: StatisticItem): number => {
    if (a[property] < b[property]) {
      return 1;
    }
    if (a[property] > b[property]) {
      return -1;
    }
    return 0;
  };

export { compareByPropUp, compareByPropDown };
