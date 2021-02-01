import { Injectable } from '@angular/core';

export type TimeRange = 'day' | 'month' | 'year' | 'all';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() {
  }

  static isTheSameDate(date1: Date, date2: Date, range: TimeRange): boolean {
    let isEqual = false;
    const date1String = this.getStringDate(date1);
    const date2String = this.getStringDate(date2);

    switch (range) {
      case 'day':
        isEqual = date1String === date2String;
        break;
      case 'month':
        isEqual = date1String.substr(0, 7) === date2String.substr(0, 7);
        break;
      case 'year':
        break;
    }
    return isEqual;
  }


  static daysInMonth(date: Date): number { // Use 1 for January, 2 for February, etc.
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  static generateDefaultValues(count: number = null): number[] {
    const defaultVal = new Array(count);

    return defaultVal.fill(0, 0, count);
  }

  static generateLastNYears(count: number): number[] {
    const $year = new Date().getFullYear();
    const result = [];

    for (let i = $year - count + 1; i <= $year; i++) {
      result.push(i);
    }

    return result;
  }

  static generateDaysLabel(date = new Date()): string[] {
    const label = [];
    for (let i = 0; i < HelperService.daysInMonth(date); i++) {
      label.push((i + 1).toString());
    }

    return label;
  }

  static generateHoursLabel(): string[] {
    const label = [];
    for (let i = 0; i < 24; i++) {
      label.push((i + 1).toString());
    }

    return label;
  }

  static generateMonthsLabel() {
    return [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
  }

  static getStringDate(date: Date, format: TimeRange = 'year'): string {
    const dateString = date.toJSON().split('T')[0];

    switch (format) {
      case 'day':
      case 'all':
        return dateString;

      case 'month':
        return dateString.substr(0, dateString.length - 3);

      case 'year':
        return dateString.substr(0, dateString.length - 6);
    }
  }

  static getDateFromString(date: string): Date {
    const dateParts = date.split('-');
    const year = +dateParts[0];
    const month = +dateParts[1] ? +dateParts[1] - 1 : 0;
    const day = +dateParts[2] ? +dateParts[2] : 1;

    return new Date(year, month, day, 12);
  }
}
