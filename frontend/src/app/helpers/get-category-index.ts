import { Category } from '../models/category';
import { CardContent } from '../models/card-content';

const getCategoryIndex = (
  category: string,
  cards: Array<Array<Category | CardContent>>,
): number => {
  const categories = cards[0] as Array<Category>;
  return categories?.findIndex(
    cat => cat.category.replace(/[\s()]/g, '').toLowerCase() === category,
  );
};
export default getCategoryIndex;
