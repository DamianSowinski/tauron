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

  static calculateTrend(a: number, b: number): number {
    return +(100 * (b - a) / a).toFixed(2);
  }

  static daysInMonth(date: Date): number { // Use 1 for January, 2 for February, etc.

    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  static generateDefaultValues(date = new Date()): number[] {
    const size = HelperService.daysInMonth(date);
    const defaultVal = new Array(size);

    return defaultVal.fill(0, 0, size);
  }

  static generateLabel(date = new Date()): string[] {
    const label = [];
    for (let i = 0; i < HelperService.daysInMonth(date); i++) {
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
}
