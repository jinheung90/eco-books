export class MathFunction {
  static randomInteger(min: number, max: number) {

    if(min > max) {
      const swap = min;
      min = max;
      max = swap;
    }

    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }
}
