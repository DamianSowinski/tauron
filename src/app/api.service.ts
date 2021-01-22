import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ENERGY_API_URL } from '../global';

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
  days: EnergyDayShort[];
}
export interface EnergyDayShort {
  day: string;
  consume: number;
  generate: number;
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  yesterdayDate: Date = null;
  monthDate: Date = null;

  private energies = new BehaviorSubject<Energy[]>(null);
  private yesterdayUsage = new BehaviorSubject<EnergyDayUsage>(null);
  private monthUsage = new BehaviorSubject<EnergyMonthUsage>(null);

  constructor(private http: HttpClient) {
  }

  private static isTheSameDate(date1: Date, date2: Date, range: 'day' | 'month' | 'year'): boolean {
    let isEqual = false;
    const date1String = date1.toISOString();
    const date2String = date2.toISOString();

    switch (range) {
      case 'day':
        isEqual = date1String.split('T')[0] === date2String.split('T')[0];
        break;
      case 'month':
        isEqual = date1String.split('T')[0].substr(0, 7) === date2String.split('T')[0].substr(0, 7);

        break;
      case 'year':
        break;
    }

    return isEqual;
  }

  getAllUsage(): BehaviorSubject<Energy[]> {
    const url = `${ENERGY_API_URL}`;

    this.http.get<Energy[]>(url, {headers: {Accept: 'application/json'}})
      .subscribe(
        (energies) => this.energies.next(energies),
        errors => console.log(errors.error.title)
      );

    return this.energies;
  }

  getYesterdayUsage(): BehaviorSubject<EnergyDayUsage> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (this.yesterdayDate && ApiService.isTheSameDate(this.yesterdayDate, yesterday, 'day') && this.yesterdayUsage) {
      return this.yesterdayUsage;
    }

    const url = `${ENERGY_API_URL}?year=${yesterday.getFullYear()}&month=${yesterday.getMonth() + 1}&day=${yesterday.getDate()}`;

    this.http.get<EnergyDayUsage>(url, {})
      .subscribe(
        (data) => {
          this.yesterdayDate = yesterday;
          this.yesterdayUsage.next(data);
        },
        errors => console.log(errors.error.title)
      );

    return this.yesterdayUsage;
  }

  getMonthUsage(): BehaviorSubject<EnergyMonthUsage> {
    const month = new Date();

    if (this.monthDate && ApiService.isTheSameDate(this.monthDate, month, 'month') && this.monthUsage) {
      return this.monthUsage;
    }

    const url = `${ENERGY_API_URL}?year=${month.getFullYear()}&month=${month.getMonth() + 1}`;

    this.http.get<EnergyMonthUsage>(url, {})
      .subscribe(
        (data) => {
          this.monthDate = month;
          this.monthUsage.next(data);
        },
        errors => console.log(errors.error.title)
      );

    return this.monthUsage;
  }
}
