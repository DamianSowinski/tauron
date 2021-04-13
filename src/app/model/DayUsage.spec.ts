import { DayUsage } from './DayUsage';
import { ZoneUsage } from './ZoneUsage';
import { MOCK_DATA } from '../../environments/environment.test';

describe('DayUsage', () => {
  it('should create an instance', () => {
    expect(new DayUsage(new Date(), new ZoneUsage(1), new ZoneUsage(1), [])).toBeTruthy();
  });

  it('should valid parse from json', () => {
    const mockData = JSON.parse(MOCK_DATA.dayUsage);
    const dayUsage = DayUsage.createFromJson(mockData);

    expect(dayUsage).toBeTruthy();
    expect(dayUsage.date.toJSON().split('T')[0]).toEqual(mockData.date);
    expect(dayUsage.consume.total).toEqual(mockData.consume.total);
    expect(dayUsage.generate.total).toEqual(mockData.generate.total);
    expect(dayUsage.hours).toHaveSize(mockData.hours.length);
    expect(dayUsage.hours[0].hour).toEqual(mockData.hours[0].hour);
    expect(dayUsage.hours[0].consume).toEqual(mockData.hours[0].consume);
    expect(dayUsage.hours[0].generate).toEqual(mockData.hours[0].generate);
  });
});
