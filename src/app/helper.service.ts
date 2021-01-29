import { Injectable } from '@angular/core';

export type TimeRange = 'day' | 'month' | 'year';

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

  static generateMonthsRange() {
    return [
      {title: 'January', value: 1, isSelected: true},
      {title: 'February', value: 2, isSelected: false},
      {title: 'March', value: 3, isSelected: false},
      {title: 'April', value: 4, isSelected: false},
      {title: 'May', value: 5, isSelected: false},
      {title: 'June', value: 6, isSelected: false},
      {title: 'July', value: 7, isSelected: false},
      {title: 'August', value: 8, isSelected: false},
      {title: 'September', value: 9, isSelected: false},
      {title: 'October', value: 10, isSelected: false},
      {title: 'November', value: 11, isSelected: false},
      {title: 'December', value: 12, isSelected: false},
    ];
  }

  static getStringDate(date: Date): string {
    return date.toJSON().split('T')[0];
  }

  static getDateFromString(date: string): Date {
    const dateParts = date.split('-');
    return new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2], 12);
  }
}
