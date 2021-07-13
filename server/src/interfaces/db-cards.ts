import { Card, Category } from './card-array';

export interface DbCards {
  _id: string;
  data: Array<Array<Card | Category>>;
}
