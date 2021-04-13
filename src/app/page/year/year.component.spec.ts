import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearComponent } from './year.component';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../service/api.service';
import { LoginService } from '../../shared/login/login.service';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HelperService } from '../../service/helper.service';
import { MOCK_YEARS_USAGE } from '../../../environments/environment.test';
import { BehaviorSubject } from 'rxjs';
import { YearUsage } from '../../model/YearUsage';

describe('YearComponent', () => {
  const mockYearUsageData = MOCK_YEARS_USAGE[0];
  let component: YearComponent;
  let fixture: ComponentFixture<YearComponent>;
  let title: Title;
  let apiService: jasmine.SpyObj<ApiService>;
  let loginService: jasmine.SpyObj<LoginService>;
  let helperService: jasmine.SpyObj<HelperService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, ReactiveFormsModule],
      declarations: [YearComponent],
      providers: [
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj('ApiService', ['getYearUsage'])
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
    const year = new Date(2000, 0, 1, 12);
    year.setFullYear(mockYearUsageData.year);

    loginService.getLoginState.and.returnValue(new BehaviorSubject(true));
    apiService.getYearUsage.and.returnValue(new Promise<YearUsage>(resolve => resolve(mockYearUsageData)));
    helperService.getSelectedDate.and.returnValue(year);

    fixture = TestBed.createComponent(YearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    return fixture.whenStable().then(() => {
      expect(loginService.getLoginState).toHaveBeenCalled();
      expect(apiService.getYearUsage).toHaveBeenCalled();
    });
  });

  it('should set title', () => {
    expect(title.getTitle()).toEqual('Year usage | Energy');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.o-title').textContent).toContain('Year usage');
  });

  it('should load default data', () => {
    return fixture.whenStable().then(() => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('#selectYear').value).toEqual('2020');

      expect(component.intakeData.total.value).toEqual(3115.4);
      expect(component.generateData.total.value).toEqual(3435.59);
      expect(component.totalData.total.value).toEqual(-320.19);
      expect(component.graphData.sets.length).toEqual(2);

      expect(component.graphData.sets[0].values[0]).toEqual(253.09);
      expect(component.graphData.yAxis).toHaveSize(5);
      expect(component.graphData.yAxis[0].value).toEqual(0);
      expect(component.graphData.yAxis[4].value).toEqual(360);
      expect(component.graphData.xAxis).toHaveSize(12);
    });
  });

  it('should reload after change year', () => {
    const data = MOCK_YEARS_USAGE[1];
    const year = new Date(2000, 0, 1, 12);
    year.setFullYear(data.year);

    apiService.getYearUsage.and.returnValue(new Promise<YearUsage>(resolve => resolve(data)));
    helperService.getSelectedDate.and.returnValue(year);

    fixture = TestBed.createComponent(YearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.changeYear();

    return fixture.whenStable().then(() => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('#selectYear').value).toEqual('2021');

      expect(component.intakeData.total.value).toEqual(890.51);
      expect(component.generateData.total.value).toEqual(622.06);
      expect(component.totalData.total.value).toEqual(268.45);

      expect(component.graphData.sets).toHaveSize(2);
      expect(component.graphData.sets[0].values[0]).toEqual(322.64);
      expect(component.graphData.yAxis).toHaveSize(5);
      expect(component.graphData.yAxis[0].value).toEqual(0);
      expect(component.graphData.yAxis[4].value).toEqual(340);
      expect(component.graphData.xAxis).toHaveSize(12);
    });
  });
});
