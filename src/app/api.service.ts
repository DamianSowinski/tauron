import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENERGY_API_URL, ENERGY_API_URL_PRELOAD } from '../global';
import { HelperService, TimeRange } from './helper.service';
import { LoginService } from './login/login.service';
import { ToastService } from './shared/toast/toast.service';

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

  constructor(private http: HttpClient, private toast: ToastService) {
  }

  private static createHeader(): object {
    return {
      headers: {
        authorization: LoginService.getSessionId(),
        pointId: LoginService.getPointId()
      },
    };
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

      this.getPreloadData([yesterday], [yesterday], [yesterday]).then(
        (data) => resolve(data),
        (errors) => {
          this.toast.error(`${errors.error.title} - ${errors.error.detail}`);
          reject(errors);
        }
      );
    });
  }

  getDayUsage(date: Date = new Date()): Promise<EnergyDayUsage> {

    return new Promise((resolve, reject) => {
      const cache = this.checkCache(date, 'day');

      if (cache) {
        return resolve(cache);
      }

      const url = `${ENERGY_API_URL}?year=${date.getFullYear()}&month=${date.getMonth() + 1}&day=${date.getDate()}`;
      const header = ApiService.createHeader();

      this.http.get<EnergyDayUsage>(url, header)
        .subscribe(
          (data) => {
            this.cache.push({range: 'day', date, cache: data});
            return resolve(data);
          },
          errors => {
            this.toast.error(`${errors.error.title} - ${errors.error.detail}`);
            reject(errors);
          }
        );
    });
  }

  getMonthUsage(date: Date = new Date()): Promise<EnergyMonthUsage> {
    return new Promise<EnergyMonthUsage>((resolve, reject) => {
      const cache = this.checkCache(date, 'month');

      if (cache) {
        return resolve(cache);
      }

      const url = `${ENERGY_API_URL}?year=${date.getFullYear()}&month=${date.getMonth() + 1}`;
      const header = ApiService.createHeader();

      this.http.get<EnergyMonthUsage>(url, header)
        .subscribe(
          (data) => {
            this.cache.push({date, cache: data, range: 'month'});
            return resolve(data);
          },
          errors => {
            this.toast.error(`${errors.error.title} - ${errors.error.detail}`);
            reject(errors);
          }
        );
    });
  }

  getYearUsage(date: Date = new Date()): Promise<EnergyYearUsage> {
    return new Promise<EnergyYearUsage>((resolve, reject) => {
      const cache = this.checkCache(date, 'year');

      if (cache) {
        return resolve(cache);
      }

      const url = `${ENERGY_API_URL}?year=${date.getFullYear()}`;
      const header = ApiService.createHeader();

      this.http.get<EnergyYearUsage>(url, header)
        .subscribe(
          (data) => {
            this.cache.push({date, cache: data, range: 'year'});
            return resolve(data);
          },
          errors => {
            this.toast.error(`${errors.error.title} - ${errors.error.detail}`);
            reject(errors);
          }
        );
    });
  }

  getRangeUsage(startDate: Date, endDate: Date): Promise<EnergyRangeUsage> {
    return new Promise<EnergyRangeUsage>((resolve, reject) => {
      const cache = this.checkCache(startDate, 'range', endDate);

      if (cache) {
        return resolve(cache);
      }

      const startDateStr = HelperService.getStringFromDate(startDate, 'month');
      const endDateStr = HelperService.getStringFromDate(endDate, 'month');

      const url = `${ENERGY_API_URL}?range[]=${startDateStr}&range[]=${endDateStr}`;
      const header = ApiService.createHeader();

      this.http.get<EnergyRangeUsage>(url, header)
        .subscribe(
          (data) => {
            this.cache.push({date: startDate, dateEnd: endDate, cache: data, range: 'range'});
            return resolve(data);
          },
          errors => {
            this.toast.error(`${errors.error.title} - ${errors.error.detail}`);
            reject(errors);
          }
        );
    });
  }

  getPreloadData(days: Date[] = [], months: Date[] = [], years: Date[] = []): Promise<EnergyPreloadData> {
    return new Promise<EnergyPreloadData>((resolve, reject) => {

      days = days.filter((day) => !this.checkCache(day, 'day'));
      months = months.filter((month) => !this.checkCache(month, 'month'));
      years = years.filter((year) => !this.checkCache(year, 'year'));

      const url = ENERGY_API_URL_PRELOAD;
      const requestContent = {
        days: days.map((item) => HelperService.getStringFromDate(item, 'day')),
        months: months.map((item) => HelperService.getStringFromDate(item, 'month')),
        years,
      };
      const header = ApiService.createHeader();

      this.http.post<EnergyPreloadData>(url, requestContent, header)
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
          (errors) => {
            this.toast.error(`${errors.error.title} - ${errors.error.detail}`);
            reject(errors);
          }
        );

    });
  }

  clearCache() {
    this.cache = [];
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
}
