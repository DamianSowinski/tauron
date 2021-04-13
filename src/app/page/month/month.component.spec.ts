import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthComponent } from './month.component';
import { Title } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { LoginService } from '../../shared/login/login.service';
import { HelperService } from '../../service/helper.service';
import { BehaviorSubject } from 'rxjs';
import { MonthUsage } from '../../model/MonthUsage';
import { MOCK_MONTHS_USAGE } from '../../../environments/environment.test';

describe('MonthComponent', () => {
  const mockMonthUsageData = MOCK_MONTHS_USAGE[0];
  let component: MonthComponent;
  let fixture: ComponentFixture<MonthComponent>;
  let title: Title;
  let apiService: jasmine.SpyObj<ApiService>;
  let loginService: jasmine.SpyObj<LoginService>;
  let helperService: jasmine.SpyObj<HelperService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, ReactiveFormsModule],
      declarations: [MonthComponent],
      providers: [
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj('ApiService', ['getMonthUsage'])
        },
        {
          provide: LoginService,
          useValue: jasmine.createSpyObj('LoginService', ['getLoginState'])
        },
        {
          provide: HelperService,
          useValue: jasmine.createSpyObj('HelperService', ['getSelectedDate', 'setSelectedDate'])
        },
        Title
      ]
    }).compileComponents();

    title = TestBed.inject(Title);
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    helperService = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
  });

  beforeEach(() => {
    loginService.getLoginState.and.returnValue(new BehaviorSubject(true));
    apiService.getMonthUsage.and.returnValue(new Promise<MonthUsage>(resolve => resolve(mockMonthUsageData)));
    helperService.getSelectedDate.and.returnValue(mockMonthUsageData.date);

    fixture = TestBed.createComponent(MonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    return fixture.whenStable().then(() => {
      expect(loginService.getLoginState).toHaveBeenCalled();
      expect(apiService.getMonthUsage).toHaveBeenCalled();
    });
  });

  it('should set title', () => {
    expect(title.getTitle()).toEqual('Month usage | Energy');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.o-title').textContent).toContain('Month usage');
  });

  it('should load default data', () => {
    return fixture.whenStable().then(() => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('#inputDate').value).toEqual('2020-01');

      expect(component.intakeData.total.value).toEqual(322.64);
      expect(component.generateData.total.value).toEqual(58.62);
      expect(component.totalData.total.value).toEqual(264.02);
      expect(component.graphData.sets.length).toEqual(2);

      expect(component.graphData.sets[0].values[0]).toEqual(9.18);
      expect(component.graphData.yAxis).toHaveSize(5);
      expect(component.graphData.yAxis[0].value).toEqual(0);
      expect(component.graphData.yAxis[4].value).toEqual(12);
      expect(component.graphData.xAxis).toHaveSize(31);
    });
  });

  it('should reload after change month', () => {
    const data = MOCK_MONTHS_USAGE[1];

    apiService.getMonthUsage.and.returnValue(new Promise<MonthUsage>(resolve => resolve(data)));
    helperService.getSelectedDate.and.returnValue(data.date);

    fixture = TestBed.createComponent(MonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.changeMonth();

    return fixture.whenStable().then(() => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('#inputDate').value).toEqual('2020-02');

      expect(component.intakeData.total.value).toEqual(271.27);
      expect(component.generateData.total.value).toEqual(143.75);
      expect(component.totalData.total.value).toEqual(127.52);

      expect(component.graphData.sets.length).toEqual(2);
      expect(component.graphData.sets[0].values[0]).toEqual(7.66);
      expect(component.graphData.yAxis).toHaveSize(5);
      expect(component.graphData.yAxis[0].value).toEqual(0);
      expect(component.graphData.yAxis[4].value).toEqual(8);
      expect(component.graphData.xAxis).toHaveSize(29);
    });
  });
});
