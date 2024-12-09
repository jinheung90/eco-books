export class ZResultWithScoreDao<T> {
  value: T;
  score: number;

  constructor(value: T, score: number) {
    this.value = value;
    this.score = score;
  }
}
