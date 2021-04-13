import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayComponent } from './day.component';
import { Title } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/card/card.component';
import { GraphComponent } from '../../shared/graph/graph.component';
import { ApiService } from '../../service/api.service';
import { LoginService } from '../../shared/login/login.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DayUsage } from '../../model/DayUsage';
import { MOCK_DAYS_USAGE } from '../../../environments/environment.test';
import { BehaviorSubject } from 'rxjs';
import { HelperService } from '../../service/helper.service';

describe('DayComponent', () => {
  const mockDayUsageData = MOCK_DAYS_USAGE[0];
  let component: DayComponent;
  let fixture: ComponentFixture<DayComponent>;
  let title: Title;
  let apiService: jasmine.SpyObj<ApiService>;
  let loginService: jasmine.SpyObj<LoginService>;
  let helperService: jasmine.SpyObj<HelperService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, ReactiveFormsModule],
      declarations: [DayComponent, CardComponent, GraphComponent],
      providers: [
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj('ApiService', ['getDayUsage'])
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
    apiService.getDayUsage.and.returnValue(new Promise<DayUsage>(resolve => resolve(mockDayUsageData)));
    helperService.getSelectedDate.and.returnValue(mockDayUsageData.date);

    fixture = TestBed.createComponent(DayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    return fixture.whenStable().then(() => {
      expect(loginService.getLoginState).toHaveBeenCalled();
      expect(apiService.getDayUsage).toHaveBeenCalled();
    });
  });

  it('should set title', () => {
    expect(title.getTitle()).toEqual('Day usage | Energy');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.o-title').textContent).toContain('Day usage');
  });

  it('should load default data', () => {
    return fixture.whenStable().then(() => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('#inputDate').value).toEqual('2020-01-01');

      expect(component.intakeData.total.value).toEqual(7);
      expect(component.generateData.total.value).toEqual(28);
      expect(component.totalData.total.value).toEqual(-21);
      expect(component.graphData.sets.length).toEqual(2);

      expect(component.graphData.sets[0].values[0]).toEqual(2.15);
      expect(component.graphData.yAxis).toHaveSize(5);
      expect(component.graphData.yAxis[0].value).toEqual(0);
      expect(component.graphData.yAxis[4].value).toEqual(4);
      expect(component.graphData.xAxis).toHaveSize(24);
    });
  });

  it('should reload after change day', () => {
    const data = MOCK_DAYS_USAGE[1];

    apiService.getDayUsage.and.returnValue(new Promise<DayUsage>(resolve => resolve(data)));
    helperService.getSelectedDate.and.returnValue(data.date);

    fixture = TestBed.createComponent(DayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.changeDay();

    return fixture.whenStable().then(() => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('#inputDate').value).toEqual('2020-01-13');

      expect(component.intakeData.total.value).toEqual(9);
      expect(component.generateData.total.value).toEqual(25);
      expect(component.totalData.total.value).toEqual(-16);

      expect(component.graphData.sets.length).toEqual(2);
      expect(component.graphData.sets[0].values[0]).toEqual(5.15);
      expect(component.graphData.yAxis).toHaveSize(5);
      expect(component.graphData.yAxis[0].value).toEqual(0);
      expect(component.graphData.yAxis[4].value).toEqual(8);
      expect(component.graphData.xAxis).toHaveSize(24);
    });
  });
});
