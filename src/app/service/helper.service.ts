import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type DateRange = 'day' | 'month' | 'year';
export type SelectType = 'day' | 'month' | 'year' | 'range';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private selectedDate: {
    day: Date;
    month: Date;
    year: Date;
    range: {
      start: Date;
      end?: Date;
    }
  };
  private isDarkMode = new BehaviorSubject<boolean>(false);

  constructor() {
    this.setDefaultSelectedDate();
    this.setColourPreference();
  }

  static isTheSameDate(date1: Date, date2: Date, range: DateRange): boolean {
    let isEqual = false;
    const date1String = this.getStringFromDate(date1, 'day');
    const date2String = this.getStringFromDate(date2, 'day');

    switch (range) {
      case 'day':
        isEqual = date1String === date2String;
        break;
      case 'month':
        isEqual = date1String.substr(0, 7) === date2String.substr(0, 7);
        break;
      case 'year':
        isEqual = date1String.substr(0, 4) === date2String.substr(0, 4);
        break;
    }
    return isEqual;
  }

  static getStringFromDate(date: Date, format: DateRange, reverse: boolean = false): string {
    const dateCopy = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0);
    const dateString = dateCopy.toJSON().split('T')[0];

    switch (format) {
      case 'day':
        return reverse ? dateString.split('-').reverse().join('-') : dateString;
      case 'month':
        const $monthString = dateString.substr(0, dateString.length - 3);
        return reverse ? $monthString.split('-').reverse().join('-') : $monthString;
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

  static daysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  static generateEmptyArray(count: number = null): number[] {
    return new Array(count).fill(0, 0, count);
  }

  static generateLastNYears(count: number): number[] {
    let year = new Date().getFullYear();

    return new Array(count)
      .fill(0, 0, count)
      .map(() => year--)
      .reverse();
  }

  static generateDaysLabel(date = new Date()): string[] {
    const days = HelperService.daysInMonth(date);

    return new Array(days)
      .fill(0, 0, days)
      .map((item, i) => (i + 1).toString());
  }

  static generateHoursLabel(): string[] {
    return new Array(24)
      .fill(0, 0, 24)
      .map((item, i) => (i + 1).toString());
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

  static generateRangeLabels(dateStart: Date, dateEnd: Date): string[] {
    const labels = [];
    const currentDate = new Date(dateStart.getFullYear(), dateStart.getMonth(), 1, 12);
    const end = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), 1, 12);

    while (currentDate <= end) {
      labels.push(HelperService.getStringFromDate(currentDate, 'month'));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return labels;
  }

  static getYesterdayDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12);
  }

  public setSelectedDate(date: Date, mode: SelectType, isEndDate = false): void {
    switch (mode) {
      case 'day':
        this.selectedDate.day = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
        break;
      case 'month':
        this.selectedDate.month = new Date(date.getFullYear(), date.getMonth(), 1, 12);
        break;
      case 'year':
        this.selectedDate.year = new Date(date.getFullYear(), 0, 1, 12);
        break;
      case 'range':
        const rangeDate = new Date(date.getFullYear(), date.getMonth(), 1, 12);
        if (isEndDate) {
          this.selectedDate.range.end = rangeDate;
        } else {
          this.selectedDate.range.start = rangeDate;
        }
        break;
    }
  }

  public getSelectedDate(mode: SelectType, isEndDate = false): Date {
    switch (mode) {
      case 'day':
        return this.selectedDate.day;
      case 'month':
        return this.selectedDate.month;
      case 'year':
        return this.selectedDate.year;
      case 'range':
        return isEndDate ? this.selectedDate.range.end : this.selectedDate.range.start;
    }
  }

  public getDarkModeState(): BehaviorSubject<boolean> {
    return this.isDarkMode;
  }

  public toggleDarkModeState(): void {
    const currentState = this.isDarkMode.value;
    this.isDarkMode.next(!currentState);
    localStorage.setItem('darkMode', !currentState ? '1' : '0');
  }

  public setDarkModeBodyClass(): void {
    this.isDarkMode.subscribe((isDarkMode) => {
      if (isDarkMode) {
        window.document.body.classList.add('dark');
      } else {
        window.document.body.classList.remove('dark');
      }
    });
  }

  private setDefaultSelectedDate(): void {
    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1, 12);
    const thisYear = new Date(now.getFullYear(), 0, 1, 12);

    this.selectedDate = {
      day: yesterday,
      month: thisMonth,
      year: thisYear,
      range: {
        start: thisYear,
        end: thisMonth
      }
    };
  }

  private setColourPreference(): void {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const isLocalStorageSet = localStorage.getItem('darkMode') as string;

    let isDarkMode: boolean;

    if (isLocalStorageSet === null) {
      isDarkMode = prefersDarkScheme.matches;
    } else {
      isDarkMode = !!(+isLocalStorageSet);
    }

    this.isDarkMode.next(isDarkMode);
    this.setDarkModeBodyClass();
  }


}
