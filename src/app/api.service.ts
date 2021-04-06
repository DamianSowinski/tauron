import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService, TimeRange } from './helper.service';
import { LoginService } from './login/login.service';
import { ToastService } from './shared/toast/toast.service';
import { ENERGY_API_URL, ENERGY_API_URL_COLLECTION } from '../environments/environment';

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

export interface EnergyCollection {
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
        Authorization: LoginService.getTokenFromLocalStorage(),
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
    };
  }

  getHomeData(): Promise<EnergyCollection> {
    return new Promise<EnergyCollection>((resolve, reject) => {

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

      this.getCollection([yesterday], [yesterday], [yesterday]).then(
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

      const dateString = HelperService.getStringFromDate(date, 'day', true);
      const url = `${ENERGY_API_URL}/days/${dateString}`;
      const header = ApiService.createHeader();

      this.http.get<EnergyDayUsage>(url, header)
        .subscribe(
          (data) => {

            this.cache.push({range: 'day', date, cache: data});
            return resolve(data);
          },
          errors => {
            console.log(errors);

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

      const dateString = HelperService.getStringFromDate(date, 'month', true);
      const url = `${ENERGY_API_URL}/months/${dateString}`;
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

      const dateString = HelperService.getStringFromDate(date, 'year');
      const url = `${ENERGY_API_URL}/years/${dateString}`;
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

      const startDateStr = HelperService.getStringFromDate(startDate, 'month', true);
      const endDateStr = HelperService.getStringFromDate(endDate, 'month', true);

      const url = `${ENERGY_API_URL}/range?startDate=${startDateStr}&endDate=${endDateStr}`;
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

  getCollection(days: Date[] = [], months: Date[] = [], years: Date[] = []): Promise<EnergyCollection> {
    return new Promise<EnergyCollection>((resolve, reject) => {

      days = days.filter((day) => !this.checkCache(day, 'day'));
      months = months.filter((month) => !this.checkCache(month, 'month'));
      years = years.filter((year) => !this.checkCache(year, 'year'));

      const queryString = this.createCollectionQueryString(days, months, years);
      const url = ENERGY_API_URL_COLLECTION + queryString;
      const header = ApiService.createHeader();

      this.http.get<EnergyCollection>(url, header)
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

  private createCollectionQueryString(days: Date[] = [], months: Date[] = [], years: Date[] = []): string {
    const items = [];

    items.push(days
      .map((day) => 'days[]=' + HelperService.getStringFromDate(day, 'day', true))
      .join('&')
    );

    items.push(months
      .map((month) => 'months[]=' + HelperService.getStringFromDate(month, 'month', true))
      .join('&')
    );

    items.push(years
      .map((year) => 'years[]=' + HelperService.getStringFromDate(year, 'year'))
      .join('&')
    );

    return items.length > 0 ? `?${items.join('&')}` : '';
  }
}
