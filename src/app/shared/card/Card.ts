export class Card {
  title: string;
  total: {
    value: number;
    trend?: number;
  };
  detail1: {
    ico: string;
    title: string;
    value: number;
    colour: string;
    trend?: number;
  };
  detail2: {
    ico: string;
    title: string;
    value: number;
    colour: string;
    trend?: number;
  };

  constructor(title: string, details1Title: string, details2Title: string) {
    this.title = title;
    this.total = {value: 0, trend: null};
    this.detail1 = {ico: 'sun', title: details1Title, value: 0, colour: '#FFCA83', trend: null};
    this.detail2 = {ico: 'moon', title: details2Title, value: 0, colour: '#55D8FE', trend: null};
  }

  private static calculateTrend(a: number, b: number): number {
    return +(100 * (b - a) / a).toFixed(2);
  }

  setColours(col1: string, col2: string): void {
    this.detail1.colour = col1;
    this.detail2.colour = col2;
  }

  setIcons(ico1: string, ico2: string): void {
    this.detail1.ico = ico1;
    this.detail2.ico = ico2;
  }

  updateValues(total: number, detail1: number, detail2: number) {
    this.total.value = +total.toFixed(2);
    this.detail1.value = +detail1.toFixed(2);
    this.detail2.value = +detail2.toFixed(2);
  }

  calculateTrends(total: number, detail1: number, detail2: number) {
    this.total.trend = Card.calculateTrend(total, this.total.value);
    this.detail1.trend = Card.calculateTrend(detail1, this.detail1.value);
    this.detail2.trend = Card.calculateTrend(detail2, this.detail2.value);
  }

  calculateMainTrends(value1: number, value2: number) {
    this.total.trend = +(-(100 - +(100 * value2 / value1)).toFixed(2));
  }
}
