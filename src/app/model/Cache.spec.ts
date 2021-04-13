import { ZoneUsage } from './ZoneUsage';
import { DayUsage } from './DayUsage';
import { Cache } from './Cache';
import { MonthUsage } from './MonthUsage';
import { YearUsage } from './YearUsage';
import { RangeUsage } from './RangeUsage';
import { CollectionUsage } from './CollectionUsage';
import {
  MOCK_DAYS_USAGE,
  MOCK_MONTHS_USAGE,
  MOCK_RANGES_USAGE,
  MOCK_YEARS_USAGE
} from '../../environments/environment.test';

describe('Cache', () => {
  const [monday, friday] = MOCK_DAYS_USAGE;
  const [january, february] = MOCK_MONTHS_USAGE;
  const [prevYear, thisYear] = MOCK_YEARS_USAGE;
  const [janFeb, janMar] = MOCK_RANGES_USAGE;

  it('should create an instance', () => {
    expect(new Cache()).toBeTruthy();
  });

  it('should add new element to cache', () => {
    const cache = new Cache();
    cache.addDay(monday);
    cache.addDay(friday);
    cache.addMonth(january);
    cache.addMonth(february);
    cache.addYear(prevYear);
    cache.addYear(thisYear);
    cache.addRange(janFeb);
    cache.addRange(janMar);

    expect(cache.checkDay(monday.date)).toEqual(monday);
    expect(cache.checkDay(friday.date)).toEqual(friday);
    expect(cache.checkMonth(january.date)).toEqual(january);
    expect(cache.checkMonth(february.date)).toEqual(february);
    expect(cache.checkYear(prevYear.year)).toEqual(prevYear);
    expect(cache.checkYear(thisYear.year)).toEqual(thisYear);
    expect(cache.checkRange(janFeb.startDate, janFeb.endDate)).toEqual(janFeb);
    expect(cache.checkRange(janMar.startDate, janMar.endDate)).toEqual(janMar);
  });

  it('should update element if already exist', () => {
    const cache = new Cache();
    cache.addDay(monday);
    cache.addMonth(january);
    cache.addYear(thisYear);
    cache.addRange(janFeb);

    const mondayUpdate = new DayUsage(monday.date, new ZoneUsage(500, 100, 600), monday.generate, monday.hours);
    const januaryUpdate = new MonthUsage(
      new Date(january.date.getFullYear(), january.date.getMonth(), january.date.getDate() + 1),
      january.consume,
      january.generate,
      january.days
    );
    const thisYearUpdate = new YearUsage(
      thisYear.year,
      new ZoneUsage(500, 100, 600),
      thisYear.generate,
      thisYear.months
    );
    const janFebUpdate = new RangeUsage(
      janFeb.startDate,
      new Date(janFeb.endDate.getFullYear(), janFeb.endDate.getMonth(), janFeb.endDate.getDate() + 1),
      new ZoneUsage(500, 100, 600),
      janFeb.generate,
      janFeb.months
    );

    cache.addDay(mondayUpdate);
    cache.addMonth(januaryUpdate);
    cache.addYear(thisYearUpdate);
    cache.addRange(janFebUpdate);

    // tslint:disable-next-line:no-string-literal
    expect(cache['_days']).toHaveSize(1);
    expect(cache.checkDay(monday.date)).toEqual(mondayUpdate);
    // tslint:disable-next-line:no-string-literal
    expect(cache['_months']).toHaveSize(1);
    expect(cache.checkMonth(january.date)).toEqual(januaryUpdate);
    // tslint:disable-next-line:no-string-literal
    expect(cache['_years']).toHaveSize(1);
    expect(cache.checkYear(thisYear.year)).toEqual(thisYearUpdate);
    // tslint:disable-next-line:no-string-literal
    expect(cache['_ranges']).toHaveSize(1);
    expect(cache.checkRange(janFeb.startDate, janFeb.endDate)).toEqual(janFebUpdate);
  });

  it('should fill from collection', () => {
    const cache = new Cache();
    const collection = new CollectionUsage(MOCK_DAYS_USAGE, MOCK_MONTHS_USAGE, MOCK_YEARS_USAGE);

    cache.addFromCollection(collection);

    // tslint:disable-next-line:no-string-literal
    expect(cache['_days']).toHaveSize(MOCK_DAYS_USAGE.length);
    // tslint:disable-next-line:no-string-literal
    expect(cache['_months']).toHaveSize(MOCK_MONTHS_USAGE.length);
    // tslint:disable-next-line:no-string-literal
    expect(cache['_years']).toHaveSize(MOCK_YEARS_USAGE.length);
    expect(cache.checkYear(thisYear.year)).toEqual(thisYear);
  });

  it('checkCollection should return uncached elements', () => {
    const cache = new Cache();
    cache.addDay(monday);
    cache.addMonth(january);
    cache.addYear(thisYear);

    const uncached = cache.checkCollection([monday.date, friday.date], [january.date, february.date], [thisYear.year, prevYear.year]);

    expect(uncached).toEqual({
      days: [friday.date],
      months: [february.date],
      years: [prevYear.year],
    });
  });

  it('should return collection', () => {
    const cache = new Cache();
    cache.addDay(monday);
    cache.addDay(friday);
    cache.addMonth(january);
    cache.addMonth(february);
    cache.addYear(prevYear);
    cache.addYear(thisYear);

    const collection = cache.getCollection([monday.date, friday.date], [january.date, february.date], [thisYear.year, prevYear.year]);

    expect(collection.days).toEqual([monday, friday]);
    expect(collection.months).toEqual([january, february]);
    expect(collection.years).toEqual([thisYear, prevYear]);
  });
});
