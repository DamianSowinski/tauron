import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SharedModule } from '../shared/shared.module';
import { ENERGY_API_URL, ENERGY_API_URL_COLLECTION } from '../../environments/environment';
import {
  MOCK_DAYS_USAGE,
  MOCK_MONTHS_USAGE,
  MOCK_RANGES_USAGE,
  MOCK_YEARS_USAGE
} from '../../environments/environment.test';
import { CollectionUsage } from '../model/CollectionUsage';
import { ToastService } from '../shared/toast/toast.service';

describe('ApiService', () => {
  let service: ApiService;
  let toastService: ToastService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule],
      providers: [ApiService, ToastService]
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ApiService);
    toastService = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch day usage', () => {
    const data = MOCK_DAYS_USAGE[0];

    service.getDayUsage(data.date).then((response) =>
      expect(response).toEqual(data)
    );

    const req = httpMock.expectOne(`${ENERGY_API_URL}/days/01-01-2020`);

    expect(req.request.method).toEqual('GET');

    req.flush(data.toObject());
  });

  it('should fetch month usage', () => {
    const data = MOCK_MONTHS_USAGE[0];

    service.getMonthUsage(data.date).then((response) =>
      expect(response).toEqual(data)
    );

    const req = httpMock.expectOne(`${ENERGY_API_URL}/months/01-2020`);

    expect(req.request.method).toEqual('GET');

    req.flush(data.toObject());
  });

  it('should fetch year usage', () => {
    const data = MOCK_YEARS_USAGE[0];

    service.getYearUsage(data.year).then((response) => {
        expect(response).toEqual(data);
      }
    );

    const req = httpMock.expectOne(`${ENERGY_API_URL}/years/2020`);

    expect(req.request.method).toEqual('GET');

    req.flush(data.toObject(), {headers: {Accept: 'application/json'}});
  });

  it('should fetch range usage', () => {
    const data = MOCK_RANGES_USAGE[0];

    service.getRangeUsage(data.startDate, data.endDate).then((response) =>
      expect(response).toEqual(data)
    );

    const startDate = data.startDate.toJSON().substr(0, 7).split('-').reverse().join('-');
    const endDate = data.endDate.toJSON().substr(0, 7).split('-').reverse().join('-');

    const req = httpMock.expectOne(`${ENERGY_API_URL}/range?startDate=${startDate}&endDate=${endDate}`);

    expect(req.request.method).toEqual('GET');

    req.flush(data.toObject());
  });

  it('should fetch collection', () => {
    const data = new CollectionUsage([MOCK_DAYS_USAGE[0]], [MOCK_MONTHS_USAGE[0]], [MOCK_YEARS_USAGE[0]]);

    service.getCollection([data.days[0].date], [data.months[0].date], [data.years[0].year]).then((response) =>
      expect(response).toEqual(data)
    );

    const dayDate = data.days[0].date.toJSON().substr(0, 10).split('-').reverse().join('-');
    const monthDate = data.months[0].date.toJSON().substr(0, 7).split('-').reverse().join('-');
    const yearDate = data.years[0].year;

    const req = httpMock.expectOne(`${ENERGY_API_URL_COLLECTION}?days[]=${dayDate}&months[]=${monthDate}&years[]=${yearDate}`);

    expect(req.request.method).toEqual('GET');

    req.flush(data.toObject());
  });

  afterEach(() => {
    httpMock.verify();
  });
});
