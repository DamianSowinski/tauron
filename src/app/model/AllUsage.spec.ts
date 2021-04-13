import { ZoneUsage } from './ZoneUsage';
import { AllUsage } from './AllUsage';
import { MOCK_DATA } from '../../environments/environment.test';

describe('AllUsage', () => {
  it('should create an instance', () => {
    expect(new AllUsage(new ZoneUsage(1), new ZoneUsage(1), [])).toBeTruthy();
  });

  it('should valid parse from json', () => {
    const mockData = JSON.parse(MOCK_DATA.allUsage);
    const allUsage = AllUsage.createFromJson(mockData);

    expect(allUsage).toBeTruthy();
    expect(allUsage.consume.total).toEqual(mockData.consume.total);
    expect(allUsage.generate.total).toEqual(mockData.generate.total);
    expect(allUsage.years).toHaveSize(mockData.years.length);
    expect(allUsage.years[0].year).toEqual(mockData.years[0].year);
    expect(allUsage.years[0].consume).toEqual(mockData.years[0].consume);
    expect(allUsage.years[0].generate).toEqual(mockData.years[0].generate);
  });
});

