import { DayUsage } from './DayUsage';
import { MonthUsage } from './MonthUsage';
import { YearUsage } from './YearUsage';

export class CollectionUsage {
  private readonly _days: DayUsage[];
  private readonly _months: MonthUsage[];
  private readonly _years: YearUsage[];

  constructor(days: DayUsage[], months: MonthUsage[], years: YearUsage[]) {
    this._days = days;
    this._months = months;
    this._years = years;
  }

  get days(): DayUsage[] {
    return this._days;
  }

  get months(): MonthUsage[] {
    return this._months;
  }

  get years(): YearUsage[] {
    return this._years;
  }

  static createFromJson(data: object): CollectionUsage {
    // @ts-ignore
    const {days, months, years} = data;

    return new CollectionUsage(
      days ? days.map((day) => DayUsage.createFromJson(day)) : [],
      months ? months.map((month) => MonthUsage.createFromJson(month)) : [],
      years ? years.map((year) => YearUsage.createFromJson(year)) : [],
    );
  }

  toObject(): object {
    return {
      days: this.days.map((item) => item.toObject()),
      months: this.months.map((item) => item.toObject()),
      years: this.years.map((item) => item.toObject()),
    };
  }
}
