import { DayUsage } from './DayUsage';
import { MonthUsage } from './MonthUsage';
import { YearUsage } from './YearUsage';
import { RangeUsage } from './RangeUsage';
import { CollectionUsage } from './CollectionUsage';
import { HelperService } from '../service/helper.service';

export interface UncachedCollection {
  days: Date[];
  months: Date[];
  years: number[];
}

export class Cache {
  private _days: Map<number, DayUsage>;
  private _months: Map<number, MonthUsage>;
  private _years: Map<number, YearUsage>;
  private _ranges: Map<string, RangeUsage>;

  constructor() {
    this._days = new Map([]);
    this._months = new Map([]);
    this._years = new Map([]);
    this._ranges = new Map([]);
  }

  private static generateRangeKey(startDate: Date, endDate: Date): string {
    const key1 = HelperService.getStringFromDate(startDate, 'range');
    const key2 = HelperService.getStringFromDate(endDate, 'range');

    return `${key1}-${key2}`;
  }

  private static getIdFromDate(date: Date, setDay = false): number {
    const id = new Date(1970, 0, 1);
    id.setFullYear(date.getFullYear());
    id.setMonth(date.getMonth());

    if (setDay) {
      id.setDate(date.getDate());
    }

    return +id;
  }

  addDay(day: DayUsage): void {
    const key = Cache.getIdFromDate(day.date, true);
    this._days.set(key, day);
  }

  checkDay(date: Date): DayUsage | null {
    const key = Cache.getIdFromDate(date, true);
    return this._days.has(key) ? this._days.get(key) : null;
  }

  addMonth(month: MonthUsage): void {
    const key = Cache.getIdFromDate(month.date);
    this._months.set(key, month);
  }

  checkMonth(date: Date): MonthUsage | null {
    const key = Cache.getIdFromDate(date);
    return this._months.has(key) ? this._months.get(key) : null;
  }

  addYear(year: YearUsage): void {
    this._years.set(year.year, year);
  }

  checkYear(year: number): YearUsage | null {
    return this._years.has(year) ? this._years.get(year) : null;
  }

  addRange(range: RangeUsage): void {
    const key = Cache.generateRangeKey(range.startDate, range.endDate);
    this._ranges.set(key, range);
  }

  checkRange(startDate: Date, endDate: Date): RangeUsage | null {
    const key = Cache.generateRangeKey(startDate, endDate);

    return this._ranges.has(key) ? this._ranges.get(key) : null;
  }

  addFromCollection(collection: CollectionUsage) {
    const {days, months, years} = collection;

    days.forEach((day) => this.addDay(day));
    months.forEach((month) => this.addMonth(month));
    years.forEach((year) => this.addYear(year));
  }

  checkCollection(days: Date[], months: Date[], years: number[]): UncachedCollection | null {
    const uncachedDays = [];
    const uncachedMonths = [];
    const uncachedYears = [];

    days.forEach((day) => {
      if (!this.checkDay(day)) {
        uncachedDays.push(day);
      }
    });

    months.forEach((month) => {
      if (!this.checkMonth(month)) {
        uncachedMonths.push(month);
      }
    });

    years.forEach((year) => {
      if (!this.checkYear(year)) {
        uncachedYears.push(year);
      }
    });

    return {days: uncachedDays, months: uncachedMonths, years: uncachedYears};
  }

  getCollection(days: Date[], months: Date[], years: number[]): CollectionUsage {
    return new CollectionUsage(
      days.map((date) => this.checkDay(date)),
      months.map((date) => this.checkMonth(date)),
      years.map((date) => this.checkYear(date))
    );
  }

}
