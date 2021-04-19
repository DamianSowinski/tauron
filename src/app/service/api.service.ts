import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { LoginService } from '../shared/login/login.service';
import { ENERGY_API_URL, ENERGY_API_URL_COLLECTION } from '../../environments/environment';
import { DayUsage } from '../model/DayUsage';
import { map } from 'rxjs/operators';
import { MonthUsage } from '../model/MonthUsage';
import { YearUsage } from '../model/YearUsage';
import { RangeUsage } from '../model/RangeUsage';
import { CollectionUsage } from '../model/CollectionUsage';
import { Cache, UncachedCollection } from '../model/Cache';
import { ToastService } from '../shared/toast/toast.service';


@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private cache = new Cache();

  constructor(private http: HttpClient, private toast: ToastService, private loginService: LoginService) {
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

  getDayUsage(date: Date): Promise<DayUsage> {
    return new Promise((resolve, reject) => {
      const cache = this.cache.checkDay(date);

      if (cache) {
        resolve(cache);
      }

      const dateString = HelperService.getStringFromDate(date, 'day', true);
      const url = `${ENERGY_API_URL}/days/${dateString}`;
      const header = ApiService.createHeader();

      this.http.get<object>(url, header)
        .pipe(map((data) => DayUsage.createFromJson(data)))
        .subscribe(
          (data) => {
            this.cache.addDay(data);
            resolve(data);
          },
          errors => {
            this.handleError(errors);
            reject(errors);
          }
        );
    });
  }

  getMonthUsage(date: Date): Promise<MonthUsage> {
    return new Promise<MonthUsage>((resolve, reject) => {
      const cache = this.cache.checkMonth(date);

      if (cache) {
        resolve(cache);
      }

      const dateString = HelperService.getStringFromDate(date, 'month', true);
      const url = `${ENERGY_API_URL}/months/${dateString}`;
      const header = ApiService.createHeader();

      this.http.get<object>(url, header)
        .pipe(map((data) => MonthUsage.createFromJson(data)))
        .subscribe(
          (data) => {
            this.cache.addMonth(data);
            resolve(data);
          },
          errors => {
            this.handleError(errors);
            reject(errors);
          }
        );
    });
  }

  getYearUsage(year: number): Promise<YearUsage> {
    return new Promise<YearUsage>((resolve, reject) => {
      const cache = this.cache.checkYear(year);

      if (cache) {
        resolve(cache);
      }

      const url = `${ENERGY_API_URL}/years/${year}`;
      const header = ApiService.createHeader();

      this.http.get<object>(url, header)
        .pipe(map((data) => YearUsage.createFromJson(data)))
        .subscribe(
          (data) => {
            this.cache.addYear(data);
            resolve(data);
          },
          errors => {
            this.handleError(errors);
            reject(errors);
          }
        );
    });
  }

  getRangeUsage(startDate: Date, endDate: Date): Promise<RangeUsage> {
    return new Promise<RangeUsage>((resolve, reject) => {
      const cache = this.cache.checkRange(startDate, endDate);

      if (cache) {
        resolve(cache);
      }

      const startDateStr = HelperService.getStringFromDate(startDate, 'month', true);
      const endDateStr = HelperService.getStringFromDate(endDate, 'month', true);

      const url = `${ENERGY_API_URL}/range?startDate=${startDateStr}&endDate=${endDateStr}`;
      const header = ApiService.createHeader();

      this.http.get<object>(url, header)
        .pipe(map((data) => RangeUsage.createFromJson(data)))
        .subscribe(
          (data) => {
            this.cache.addRange(data);
            resolve(data);
          },
          errors => {
            this.handleError(errors);
            reject(errors);
          }
        );
    });
  }

  getCollection(days: Date[], months: Date[], years: number[]): Promise<CollectionUsage> {
    return new Promise<CollectionUsage>((resolve, reject) => {
      const uncachedCollection = this.cache.checkCollection(days, months, years);

      if (null === uncachedCollection) {
        resolve(this.cache.getCollection(days, months, years));
      }

      const queryString = this.createCollectionQueryString(uncachedCollection);
      const url = ENERGY_API_URL_COLLECTION + queryString;
      const header = ApiService.createHeader();

      this.http.get<object>(url, header)
        .pipe(map((data) => CollectionUsage.createFromJson(data)))
        .subscribe(
          (data) => {
            this.cache.addFromCollection(data);
            const collection = this.cache.getCollection(days, months, years);
            resolve(collection);
          },
          (errors) => {
            this.handleError(errors);
            reject(errors);
          }
        );
    });
  }

  private createCollectionQueryString(collection: UncachedCollection): string {
    const {days, months, years} = collection;
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
      .map((year) => 'years[]=' + year)
      .join('&')
    );

    return items.length > 0 ? `?${items.join('&')}` : '';
  }

  private handleError(errors) {
    if (errors.status === 401) {
      this.loginService.reLogin();
    }

    this.toast.error(errors.error.title, errors.error.detail);
  }
}
