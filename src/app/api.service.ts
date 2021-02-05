import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENERGY_API_URL, ENERGY_API_URL_PRELOAD } from '../global';
import { HelperService, TimeRange } from './helper.service';

export interface Energy {
  year: number;
  consume: {
    total: number;
    day: number;
    night: number;
  };
  generate: {
    total: number;
    day: number;
    night: number;
  };
}

export interface EnergyDayUsage {
  date: string;
  consume: {
    total: number;
    day: number;
    night: number;
  };
  generate: {
    total: number;
    day: number;
    night: number;
  };
  hours: {
    hour: number;
    consume: number;
    generate: number;
  }[];
}

export interface EnergyMonthUsage {
  date: string;
  consume: {
    total: number;
    day: number;
    night: number;
  };
  generate: {
    total: number;
    day: number;
    night: number;
  };
  days: {
    day: string;
    consume: number;
    generate: number;
  }[];
}

export interface EnergyYearUsage {
  year: number;
  consume: {
    total: number;
    day: number;
    night: number;
  };
  generate: {
    total: number;
    day: number;
    night: number;
  };
  months: {
    month: string;
    consume: number;
    generate: number;
  }[];
}

export interface EnergyRangeUsage {
  consume: {
    total: number;
    day: number;
    night: number;
  };
  generate: {
    total: number;
    day: number;
    night: number;
  };
  months: {
    month: string;
    consume: number;
    generate: number;
  }[];
}

export interface EnergyPreloadData {
  days: EnergyDayUsage[];
  months: EnergyMonthUsage[];
  years: EnergyYearUsage[];
}

interface EnergyCache {
  date: Date;
  dateEnd?: Date;
  range: TimeRange;
  cache: EnergyDayUsage | EnergyMonthUsage | EnergyYearUsage | EnergyRangeUsage;
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private cache: EnergyCache[] = [];

  constructor(private http: HttpClient) {
  }

  getHomeData(): Promise<EnergyPreloadData> {

    return new Promise<EnergyPreloadData>((resolve, reject) => {

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const yesterdayCache = this.checkCache(yesterday, 'day');
      const thisMonthCache = this.checkCache(yesterday, 'month');

      if (yesterdayCache && thisMonthCache) {
        resolve({
          days: [yesterdayCache],
          months: [thisMonthCache],
          years: []
        });
      }

      this.getPreloadData([yesterday], [yesterday]).then(
        (data) => resolve(data),
        () => reject()
      );
    });
  }

  getDayUsage(date: Date = new Date()): Promise<EnergyDayUsage> {

    return new Promise((resolve) => {
      const cache = this.checkCache(date, 'day');

      if (cache) {
        return resolve(cache);
      }

      const url = `${ENERGY_API_URL}?year=${date.getFullYear()}&month=${date.getMonth() + 1}&day=${date.getDate()}`;

      this.http.get<EnergyDayUsage>(url, {})
        .subscribe(
          (data) => {
            this.cache.push({range: 'day', date, cache: data});
            return resolve(data);
          },
          errors => console.log(errors.error.title)
        );
    });
  }

  getMonthUsage(date: Date = new Date()): Promise<EnergyMonthUsage> {
    return new Promise<EnergyMonthUsage>((resolve) => {
      const cache = this.checkCache(date, 'month');

      if (cache) {
        return resolve(cache);
      }

      const url = `${ENERGY_API_URL}?year=${date.getFullYear()}&month=${date.getMonth() + 1}`;

      this.http.get<EnergyMonthUsage>(url, {})
        .subscribe(
          (data) => {
            this.cache.push({date, cache: data, range: 'month'});
            return resolve(data);
          },
          errors => console.log(errors.error.title)
        );
    });
  }

  getYearUsage(date: Date = new Date()): Promise<EnergyYearUsage> {
    return new Promise<EnergyYearUsage>((resolve) => {
      const cache = this.checkCache(date, 'year');

      if (cache) {
        return resolve(cache);
      }

      const url = `${ENERGY_API_URL}?year=${date.getFullYear()}`;

      this.http.get<EnergyYearUsage>(url, {})
        .subscribe(
          (data) => {
            this.cache.push({date, cache: data, range: 'year'});
            return resolve(data);
          },
          errors => console.log(errors.error.title)
        );
    });
  }

  getRangeUsage(startDate: Date, endDate: Date): Promise<EnergyRangeUsage> {
    return new Promise<EnergyRangeUsage>((resolve) => {
      const cache = this.checkCache(startDate, 'range', endDate);

      if (cache) {
        return resolve(cache);
      }

      const startDateStr = HelperService.getStringFromDate(startDate, 'month');
      const endDateStr = HelperService.getStringFromDate(endDate, 'month');

      const url = `${ENERGY_API_URL}?range[]=${startDateStr}&range[]=${endDateStr}`;

      this.http.get<EnergyRangeUsage>(url, {})
        .subscribe(
          (data) => {
            this.cache.push({date: startDate, dateEnd: endDate, cache: data, range: 'range'});
            return resolve(data);
          },
          errors => console.log(errors.error.title)
        );
    });
  }


  getPreloadData(days: Date[] = [], months: Date[] = [], years: Date[] = []): Promise<EnergyPreloadData> {
    return new Promise<EnergyPreloadData>((resolve, reject) => {

      days = days.filter((day) => !this.checkCache(day, 'day'));
      months = months.filter((month) => !this.checkCache(month, 'month'));
      years = years.filter((year) => !this.checkCache(year, 'year'));

      const requestContent = {
        days: days.map((item) => HelperService.getStringFromDate(item, 'day')),
        months: months.map((item) => HelperService.getStringFromDate(item, 'month')),
        years,
      };

      this.http.post<EnergyPreloadData>(ENERGY_API_URL_PRELOAD, requestContent, {})
        .subscribe(
          (data) => {
            data.days.forEach((item) => this.cache.push({
              range: 'day',
              date: HelperService.getDateFromString(item.date),
              cache: item
            }));

            data.months.forEach((item) => this.cache.push({
              range: 'month',
              date: HelperService.getDateFromString(item.date),
              cache: item
            }));

            data.years.forEach((item) => this.cache.push({
              range: 'year',
              date: new Date(item.year, 0, 1, 12),
              cache: item
            }));

            return resolve(data);
          },
          () => reject()
        );

    });
  }

  private checkCache(date: Date, type: TimeRange, dateEnd: Date = null): any {
    let cache;
    const filteredCache = this.cache.filter((item) => item.range === type);

    if (type === 'range') {
      cache = filteredCache.find((item) =>
        HelperService.isTheSameDate(item.date, date, type)
        && HelperService.isTheSameDate(item.dateEnd, dateEnd, type));
    } else {
      cache = filteredCache.find((item) => HelperService.isTheSameDate(item.date, date, type));
    }

    return cache ? cache.cache : null;
  }

  // mockGetYesterdayUsage(): BehaviorSubject<EnergyDayUsage> {
  //   this.yesterdayUsage.next({
  //     date: '24.01.2021',
  //     consume: {
  //       total: 14.14,
  //       day: 9.58,
  //       night: 4.56
  //     },
  //     generate: {
  //       total: 0.47,
  //       day: 0.31,
  //       night: 0.15
  //     },
  //     hours: [
  //       {
  //         hour: 1,
  //         consume: 0.268,
  //         generate: 0
  //       },
  //       {
  //         hour: 2,
  //         consume: 0.25,
  //         generate: 0
  //       },
  //       {
  //         hour: 3,
  //         consume: 0.266,
  //         generate: 0
  //       },
  //       {
  //         hour: 4,
  //         consume: 0.249,
  //         generate: 0
  //       },
  //       {
  //         hour: 5,
  //         consume: 0.247,
  //         generate: 0
  //       },
  //       {
  //         hour: 6,
  //         consume: 0.257,
  //         generate: 0
  //       },
  //       {
  //         hour: 7,
  //         consume: 0.258,
  //         generate: 0
  //       },
  //       {
  //         hour: 8,
  //         consume: 0.609,
  //         generate: 0
  //       },
  //       {
  //         hour: 9,
  //         consume: 2.093,
  //         generate: 0.001
  //       },
  //       {
  //         hour: 10,
  //         consume: 0.589,
  //         generate: 0.022
  //       },
  //       {
  //         hour: 11,
  //         consume: 0.496,
  //         generate: 0.201
  //       },
  //       {
  //         hour: 12,
  //         consume: 1.463,
  //         generate: 0.025
  //       },
  //       {
  //         hour: 13,
  //         consume: 1.291,
  //         generate: 0.065
  //       },
  //       {
  //         hour: 14,
  //         consume: 0.798,
  //         generate: 0.119
  //       },
  //       {
  //         hour: 15,
  //         consume: 1.555,
  //         generate: 0.035
  //       },
  //       {
  //         hour: 16,
  //         consume: 0.268,
  //         generate: 0
  //       },
  //       {
  //         hour: 17,
  //         consume: 0.443,
  //         generate: 0
  //       },
  //       {
  //         hour: 18,
  //         consume: 0.3,
  //         generate: 0
  //       },
  //       {
  //         hour: 19,
  //         consume: 0.389,
  //         generate: 0
  //       },
  //       {
  //         hour: 20,
  //         consume: 0.488,
  //         generate: 0
  //       },
  //       {
  //         hour: 21,
  //         consume: 0.468,
  //         generate: 0
  //       },
  //       {
  //         hour: 22,
  //         consume: 0.423,
  //         generate: 0
  //       },
  //       {
  //         hour: 23,
  //         consume: 0.325,
  //         generate: 0
  //       },
  //       {
  //         hour: 24,
  //         consume: 0.348,
  //         generate: 0
  //       }
  //     ]
  //
  //   });
  //
  //   return this.yesterdayUsage;
  // }

  //
  // mockGetMontUsage(): BehaviorSubject<EnergyMonthUsage> {
  //   this.monthUsage.next({
  //     date: '1 / 2021',
  //     consume: {
  //       total: 253.06,
  //       day: 169,
  //       night: 84.06
  //     },
  //     generate: {
  //       total: 38.57,
  //       day: 28.73,
  //       night: 19.69
  //     },
  //     days: [
  //       {
  //         day: '1',
  //         consume: 9.175,
  //         generate: 0.832
  //       },
  //       {
  //         day: '02',
  //         consume: 10.839,
  //         generate: 0.271
  //       },
  //       {
  //         day: '03',
  //         consume: 15.262,
  //         generate: 0.504
  //       },
  //       {
  //         day: '04',
  //         consume: 9.447,
  //         generate: 3.136
  //       },
  //       {
  //         day: '05',
  //         consume: 9.016,
  //         generate: 0.207
  //       },
  //       {
  //         day: '06',
  //         consume: 12.119,
  //         generate: 0.953
  //       },
  //       {
  //         day: '07',
  //         consume: 8.488,
  //         generate: 0.638
  //       },
  //       {
  //         day: '08',
  //         consume: 7.666,
  //         generate: 2.346
  //       },
  //       {
  //         day: '09',
  //         consume: 13.53,
  //         generate: 0.18
  //       },
  //       {
  //         day: '10',
  //         consume: 13.636,
  //         generate: 0.409
  //       },
  //       {
  //         day: '11',
  //         consume: 7.893,
  //         generate: 6.721
  //       },
  //       {
  //         day: '12',
  //         consume: 9.252,
  //         generate: 2.043
  //       },
  //       {
  //         day: '13',
  //         consume: 8.993,
  //         generate: 0.577
  //       },
  //       {
  //         day: '14',
  //         consume: 10.417,
  //         generate: 0.002
  //       },
  //       {
  //         day: '15',
  //         consume: 10.711,
  //         generate: 0.002
  //       },
  //       {
  //         day: '16',
  //         consume: 13.057,
  //         generate: 0.006
  //       },
  //       {
  //         day: '17',
  //         consume: 17.485,
  //         generate: 0.001
  //       },
  //       {
  //         day: '18',
  //         consume: 8.915,
  //         generate: 0.032
  //       },
  //       {
  //         day: '19',
  //         consume: 9.536,
  //         generate: 0.083
  //       },
  //       {
  //         day: '20',
  //         consume: 7.223,
  //         generate: 5.942
  //       },
  //       {
  //         day: '21',
  //         consume: 6.873,
  //         generate: 8.287
  //       },
  //       {
  //         day: '22',
  //         consume: 8.45,
  //         generate: 3.732
  //       },
  //       {
  //         day: '23',
  //         consume: 10.703,
  //         generate: 1.199
  //       },
  //       {
  //         day: '24',
  //         consume: 14.141,
  //         generate: 0.468
  //       },
  //       {
  //         day: '25',
  //         consume: 0.236,
  //         generate: 0
  //       }
  //     ]
  //   });
  //
  //   return this.monthUsage;
  // }
}
