import { TestBed } from '@angular/core/testing';

import { HelperService } from './helper.service';

describe('HelperService', () => {
  let service: HelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isTheSameDate should return valid data', () => {
    let date1 = new Date(2020, 0, 1, 12, 0);
    let date2 = new Date(2020, 0, 1, 12, 0);
    expect(HelperService.isTheSameDate(date1, date2, 'day')).toEqual(true);

    date1 = new Date(2020, 0, 1, 12, 0);
    date2 = new Date(2020, 0, 1, 13, 0);
    expect(HelperService.isTheSameDate(date1, date2, 'day')).toEqual(true);

    date1 = new Date(2020, 0, 1, 12, 0);
    date2 = new Date(2020, 0, 2, 13, 0);
    expect(HelperService.isTheSameDate(date1, date2, 'day')).toEqual(false);

    date1 = new Date(2020, 0, 1, 12, 0);
    date2 = new Date(2020, 0, 2, 13, 0);
    expect(HelperService.isTheSameDate(date1, date2, 'month')).toEqual(true);

    date1 = new Date(2020, 0, 1, 12, 0);
    date2 = new Date(2020, 1, 2, 13, 0);
    expect(HelperService.isTheSameDate(date1, date2, 'month')).toEqual(false);

    date1 = new Date(2020, 0, 1, 12, 0);
    date2 = new Date(2020, 1, 2, 13, 0);
    expect(HelperService.isTheSameDate(date1, date2, 'year')).toEqual(true);

    date1 = new Date(2020, 0, 1, 12, 0);
    date2 = new Date(2021, 1, 2, 13, 0);
    expect(HelperService.isTheSameDate(date1, date2, 'year')).toEqual(false);
  });

  it('getStringFrom should return valid date string', () => {
    let date = new Date(2020, 0, 1, 12, 0);
    expect(HelperService.getStringFromDate(date, 'day')).toEqual('2020-01-01');

    date = new Date(2020, 0, 12, 12, 0);
    expect(HelperService.getStringFromDate(date, 'day')).toEqual('2020-01-12');

    date = new Date(2020, 0, 32, 12, 0);
    expect(HelperService.getStringFromDate(date, 'day')).toEqual('2020-02-01');

    date = new Date(2020, 0, 12, 12, 0);
    expect(HelperService.getStringFromDate(date, 'month')).toEqual('2020-01');

    date = new Date(2020, 12, 10, 12, 0);
    expect(HelperService.getStringFromDate(date, 'month')).toEqual('2021-01');

    date = new Date(2020, 10, 10, 12, 0);
    expect(HelperService.getStringFromDate(date, 'year')).toEqual('2020');

    date = new Date(2020, 0, 1, 12, 0);
    expect(HelperService.getStringFromDate(date, 'day', true)).toEqual('01-01-2020');

    date = new Date(2020, 10, 20, 12, 0);
    expect(HelperService.getStringFromDate(date, 'day', true)).toEqual('20-11-2020');

    date = new Date(2020, 0, 12, 12, 0);
    expect(HelperService.getStringFromDate(date, 'month', true)).toEqual('01-2020');
  });

  it('getDateFromString should return valid date', () => {
    let date = HelperService.getDateFromString('2020-01-16');
    expect(date.getFullYear()).toEqual(2020);
    expect(date.getMonth()).toEqual(0);
    expect(date.getDate()).toEqual(16);
    expect(date.getHours()).toEqual(12);

    date = HelperService.getDateFromString('2020-02');
    expect(date.getFullYear()).toEqual(2020);
    expect(date.getMonth()).toEqual(1);
    expect(date.getDate()).toEqual(1);
    expect(date.getHours()).toEqual(12);

    date = HelperService.getDateFromString('2020');
    expect(date.getFullYear()).toEqual(2020);
    expect(date.getMonth()).toEqual(0);
    expect(date.getDate()).toEqual(1);
    expect(date.getHours()).toEqual(12);
  });

  it('daysInMonth should return valid days of month', () => {
    let date = new Date(2021, 0, 1, 12);
    expect(HelperService.daysInMonth(date)).toEqual(31);

    date = new Date(2021, 3, 1, 12);
    expect(HelperService.daysInMonth(date)).toEqual(30);

    date = new Date(2021, 1, 1, 12);
    expect(HelperService.daysInMonth(date)).toEqual(28);

    date = new Date(2020, 1, 1, 12);
    expect(HelperService.daysInMonth(date)).toEqual(29);

    date = new Date(2016, 1, 1, 12);
    expect(HelperService.daysInMonth(date)).toEqual(29);
  });

  it('generateEmptyArray should return empty array', () => {
    const collection = HelperService.generateEmptyArray(10);
    expect(collection).toHaveSize(10);
    expect(collection[0]).toEqual(0);
  });

  it('generateLastNYears should return fill array', () => {
    const date = new Date();
    const collection = HelperService.generateLastNYears(5);
    expect(collection).toHaveSize(5);
    expect(collection[0]).toEqual(date.getFullYear() - 4);
    expect(collection[4]).toEqual(date.getFullYear());
  });

  it('generateDaysLabel should return fill array', () => {
    let date = new Date(2020, 0, 1, 12);
    let collection = HelperService.generateDaysLabel(date);
    expect(collection).toHaveSize(31);
    expect(collection[0]).toEqual('1');
    expect(collection[30]).toEqual('31');

    date = new Date(2020, 1, 1, 12);
    collection = HelperService.generateDaysLabel(date);
    expect(collection).toHaveSize(29);
    expect(collection[0]).toEqual('1');
    expect(collection[28]).toEqual('29');
  });

  it('generateHoursLabel should return fill array', () => {
    const collection = HelperService.generateHoursLabel();
    expect(collection).toHaveSize(24);
    expect(collection[0]).toEqual('1');
    expect(collection[23]).toEqual('24');
  });

  it('generateMonthsLabel should return fill array', () => {
    const collection = HelperService.generateMonthsLabel();
    expect(collection).toHaveSize(12);
    expect(collection[0]).toEqual('Jan');
    expect(collection[11]).toEqual('Dec');
  });

  it('generateRangeLabels should return fill array', () => {
    let dateStart = new Date(2020, 0, 1, 12);
    let dateEnd = new Date(2020, 0, 1, 12);
    let collection = HelperService.generateRangeLabels(dateStart, dateEnd);
    expect(collection).toHaveSize(1);
    expect(collection[0]).toEqual('2020-01');

    dateStart = new Date(2020, 0, 1, 12);
    dateEnd = new Date(2020, 1, 12, 12);
    collection = HelperService.generateRangeLabels(dateStart, dateEnd);
    expect(collection).toHaveSize(2);
    expect(collection[0]).toEqual('2020-01');
    expect(collection[1]).toEqual('2020-02');

    dateStart = new Date(2020, 11, 18, 12);
    dateEnd = new Date(2021, 1, 1, 12);
    collection = HelperService.generateRangeLabels(dateStart, dateEnd);
    expect(collection).toHaveSize(3);
    expect(collection[0]).toEqual('2020-12');
    expect(collection[1]).toEqual('2021-01');
    expect(collection[2]).toEqual('2021-02');

    dateStart = new Date(2021, 2, 1, 12);
    dateEnd = new Date(2020, 1, 1, 12);
    collection = HelperService.generateRangeLabels(dateStart, dateEnd);
    expect(collection).toHaveSize(0);
  });

  it('should return yesterday date', () => {
    const now = new Date();
    const yesterday = HelperService.getYesterdayDate();
    expect(yesterday.getDate()).toEqual(now.getDate() - 1);
  });

  it('getSelectedDate should return valid default date', () => {
    const yesterday = HelperService.getYesterdayDate();

    let selectDate = service.getSelectedDate('day');
    expect(selectDate.toJSON()).toEqual(yesterday.toJSON());

    selectDate = service.getSelectedDate('month');
    yesterday.setDate(1);
    expect(selectDate.toJSON()).toEqual(yesterday.toJSON());

    selectDate = service.getSelectedDate('range', true);
    expect(selectDate.toJSON()).toEqual(yesterday.toJSON());

    selectDate = service.getSelectedDate('range');
    yesterday.setMonth(0);
    expect(selectDate.toJSON()).toEqual(yesterday.toJSON());

    selectDate = service.getSelectedDate('year');
    expect(selectDate.toJSON()).toEqual(yesterday.toJSON());
  });

  it('setSelectedDate should return valid date', () => {
    const date = new Date(2020, 3, 12, 12);

    service.setSelectedDate(date, 'day');
    let selectDate = service.getSelectedDate('day');
    expect(selectDate.toJSON().split('T')[0]).toEqual('2020-04-12');

    service.setSelectedDate(date, 'month');
    selectDate = service.getSelectedDate('month');
    expect(selectDate.toJSON().split('T')[0]).toEqual('2020-04-01');

    service.setSelectedDate(date, 'year');
    selectDate = service.getSelectedDate('year');
    expect(selectDate.toJSON().split('T')[0]).toEqual('2020-01-01');

    service.setSelectedDate(date, 'range');
    selectDate = service.getSelectedDate('range');
    expect(selectDate.toJSON().split('T')[0]).toEqual('2020-04-01');

    service.setSelectedDate(date, 'range', true);
    selectDate = service.getSelectedDate('range', true);
    expect(selectDate.toJSON().split('T')[0]).toEqual('2020-04-01');
  });

  it('should toggle dark mode', () => {
    const state = service.getDarkModeState();
    const prevState = state.value;

    service.toggleDarkModeState();
    const currentState = state.value;

    expect(currentState).toEqual(!prevState);
    expect(localStorage.getItem('darkMode')).toEqual(currentState ? '1' : '0');
  });

  it('should set dark to html body class', () => {
    const state = service.getDarkModeState();
    const isDarkMode = state.value;

    if (!isDarkMode) {
      service.toggleDarkModeState();
    }

    service.setDarkModeBodyClass();
    let cssClassIsSet = window.document.body.classList.contains('dark');
    expect(cssClassIsSet).toBeTruthy();

    service.toggleDarkModeState();
    service.setDarkModeBodyClass();
    cssClassIsSet = window.document.body.classList.contains('dark');
    expect(cssClassIsSet).toBeFalsy();
  });

  it('should read set colour preference', () => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    localStorage.removeItem('darkMode');

    // tslint:disable-next-line:no-string-literal
    service['setColourPreference']();
    let isDarkMode = service.getDarkModeState();

    if (prefersDarkScheme) {
      expect(isDarkMode.value).toEqual(true);
    } else {
      expect(isDarkMode.value).toEqual(false);
    }

    localStorage.setItem('darkMode', '0');
    // tslint:disable-next-line:no-string-literal
    service['setColourPreference']();
    isDarkMode = service.getDarkModeState();
    expect(isDarkMode.value).toEqual(false);

    localStorage.setItem('darkMode', '1');
    // tslint:disable-next-line:no-string-literal
    service['setColourPreference']();
    isDarkMode = service.getDarkModeState();
    expect(isDarkMode.value).toEqual(true);
  });
});
