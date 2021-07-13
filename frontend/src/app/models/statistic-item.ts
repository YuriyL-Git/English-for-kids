export interface StatisticItem {
  word: string;
  translation: string;
  category: string;
  trainingClicks: number;
  errorsCount: number;
  successCount: number;
  successRate: number;
}
