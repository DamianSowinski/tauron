import { ZoneUsage } from './ZoneUsage';
import { MonthUsage } from './MonthUsage';
import { MOCK_DATA } from '../../environments/environment.test';

describe('MonthUsage', () => {
  it('should create an instance', () => {
    expect(new MonthUsage(new Date(), new ZoneUsage(1), new ZoneUsage(1), [])).toBeTruthy();
  });

  it('should valid parse from json', () => {
    const mockData = JSON.parse(MOCK_DATA.monthUsage);
    const monthUsage = MonthUsage.createFromJson(mockData);

    expect(monthUsage).toBeTruthy();
    expect(monthUsage.date.toJSON().substr(0, 7)).toEqual(mockData.date);
    expect(monthUsage.consume.total).toEqual(mockData.consume.total);
    expect(monthUsage.generate.total).toEqual(mockData.generate.total);
    expect(monthUsage.days).toHaveSize(mockData.days.length);
    expect(monthUsage.days[0].day).toEqual(mockData.days[0].day);
    expect(monthUsage.days[0].consume).toEqual(mockData.days[0].consume);
    expect(monthUsage.days[0].generate).toEqual(mockData.days[0].generate);
  });
});
