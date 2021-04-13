import { ZoneUsage } from './ZoneUsage';
import { MonthUsage } from './MonthUsage';
import { RangeUsage } from './RangeUsage';
import { MOCK_DATA } from '../../environments/environment.test';

describe('RangeUsage', () => {
  it('should create an instance', () => {
    expect(new MonthUsage(new Date(), new ZoneUsage(1), new ZoneUsage(1), [])).toBeTruthy();
  });

  it('should valid parse from json', () => {
    const mockData = JSON.parse(MOCK_DATA.rangeUsage);
    const rangeUsage = RangeUsage.createFromJson(mockData);

    expect(rangeUsage).toBeTruthy();
    expect(rangeUsage.startDate.toJSON().substr(0, 7)).toEqual(mockData.startDate);
    expect(rangeUsage.endDate.toJSON().substr(0, 7)).toEqual(mockData.endDate);
    expect(rangeUsage.consume.total).toEqual(mockData.consume.total);
    expect(rangeUsage.generate.total).toEqual(mockData.generate.total);
    expect(rangeUsage.months).toHaveSize(mockData.months.length);
    expect(rangeUsage.months[0].month).toEqual(mockData.months[0].month);
    expect(rangeUsage.months[0].consume).toEqual(mockData.months[0].consume);
    expect(rangeUsage.months[0].generate).toEqual(mockData.months[0].generate);
  });
});
