import { ZoneUsage } from './ZoneUsage';
import { MonthUsage } from './MonthUsage';
import { CollectionUsage } from './CollectionUsage';
import { MOCK_DATA } from '../../environments/environment.test';

describe('CollectionUsage', () => {
  it('should create an instance', () => {
    expect(new MonthUsage(new Date(), new ZoneUsage(1), new ZoneUsage(1), [])).toBeTruthy();
  });

  it('should valid parse from json', () => {
    const mockData = JSON.parse(MOCK_DATA.collectionUsage);
    const collectionUsage = CollectionUsage.createFromJson(mockData);

    expect(collectionUsage).toBeTruthy();
    expect(collectionUsage.days).toHaveSize(mockData.days.length);
    expect(collectionUsage.days[0].date.toJSON().substr(0, 10)).toEqual(mockData.days[0].date);
    expect(collectionUsage.days[0].hours[0].hour).toEqual(mockData.days[0].hours[0].hour);
    expect(collectionUsage.months).toHaveSize(mockData.months.length);
    expect(collectionUsage.months[0].date.toJSON().substr(0, 7)).toEqual(mockData.months[0].date);
    expect(collectionUsage.months[0].days[0].day).toEqual(mockData.months[0].days[0].day);
    expect(collectionUsage.years).toHaveSize(mockData.years.length);
    expect(collectionUsage.years[0].year).toEqual(mockData.years[0].year);
    expect(collectionUsage.years[0].months[0].month).toEqual(mockData.years[0].months[0].month);
  });
});
