import { ZoneUsage } from './ZoneUsage';
import { YearUsage } from './YearUsage';
import { MOCK_DATA } from '../../environments/environment.test';

describe('YearUsage', () => {
  it('should create an instance', () => {
    expect(new YearUsage(2021, new ZoneUsage(1), new ZoneUsage(1), [])).toBeTruthy();
  });

  it('should valid parse from json', () => {
    const mockData = JSON.parse(MOCK_DATA.yearUsage);
    const yearUsage = YearUsage.createFromJson(mockData);

    expect(yearUsage).toBeTruthy();
    expect(yearUsage.year).toEqual(mockData.year);
    expect(yearUsage.consume.total).toEqual(mockData.consume.total);
    expect(yearUsage.generate.total).toEqual(mockData.generate.total);
    expect(yearUsage.months).toHaveSize(mockData.months.length);
    expect(yearUsage.months[0].month).toEqual(mockData.months[0].month);
    expect(yearUsage.months[0].consume).toEqual(mockData.months[0].consume);
    expect(yearUsage.months[0].generate).toEqual(mockData.months[0].generate);
  });
});
