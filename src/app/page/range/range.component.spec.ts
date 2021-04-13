import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RangeComponent } from './range.component';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../service/api.service';
import { LoginService } from '../../shared/login/login.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MOCK_RANGES_USAGE } from '../../../environments/environment.test';
import { HelperService } from '../../service/helper.service';
import { BehaviorSubject } from 'rxjs';
import { RangeUsage } from '../../model/RangeUsage';

describe('AllYearsComponent', () => {
  const mockRangeUsageData = MOCK_RANGES_USAGE[0];
  let component: RangeComponent;
  let fixture: ComponentFixture<RangeComponent>;
  let title: Title;
  let apiService: jasmine.SpyObj<ApiService>;
  let loginService: jasmine.SpyObj<LoginService>;
  let helperService: HelperService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, ReactiveFormsModule],
      declarations: [RangeComponent],
      providers: [
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj('ApiService', ['getRangeUsage'])
        },
        {
          provide: LoginService,
          useValue: jasmine.createSpyObj('LoginService', ['getLoginState'])
        },
        HelperService,
        Title
      ]
    }).compileComponents();

    title = TestBed.inject(Title);
    helperService = TestBed.inject(HelperService);
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  beforeEach(() => {
    loginService.getLoginState.and.returnValue(new BehaviorSubject(true));
    apiService.getRangeUsage.and.returnValue(new Promise<RangeUsage>(resolve => resolve(mockRangeUsageData)));
    helperService.setSelectedDate(mockRangeUsageData.startDate, 'range');
    helperService.setSelectedDate(mockRangeUsageData.endDate, 'range', true);

    fixture = TestBed.createComponent(RangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    return fixture.whenStable().then(() => {
      expect(loginService.getLoginState).toHaveBeenCalled();
      expect(apiService.getRangeUsage).toHaveBeenCalled();
    });
  });

  it('should set title', () => {
    expect(title.getTitle()).toEqual('Range usage | Energy');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.o-title').textContent).toContain('Range usage');
  });

  it('should load default data', () => {
    return fixture.whenStable().then(() => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      expect(compiled.querySelector('#inputStartDate').value).toEqual('2021-01');
      expect(compiled.querySelector('#inputEndDate').value).toEqual('2021-02');

      expect(component.intakeData.total.value).toEqual(200);
      expect(component.generateData.total.value).toEqual(400);
      expect(component.totalData.total.value).toEqual(-200);
      expect(component.graphData.sets).toHaveSize(2);

      expect(component.graphData.sets[0].values[0]).toEqual(100);
      expect(component.graphData.yAxis).toHaveSize(5);
      expect(component.graphData.yAxis[0].value).toEqual(0);
      expect(component.graphData.yAxis[4].value).toEqual(340);
      expect(component.graphData.xAxis).toHaveSize(2);
    });
  });

  it('should reload after change dates', () => {
    const data = MOCK_RANGES_USAGE[1];
    apiService.getRangeUsage.and.returnValue(new Promise<RangeUsage>(resolve => resolve(data)));
    helperService.setSelectedDate(data.startDate, 'range');
    helperService.setSelectedDate(data.endDate, 'range', true);

    fixture = TestBed.createComponent(RangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.changeEndDate();

    return fixture.whenStable().then(() => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      expect(compiled.querySelector('#inputStartDate').value).toEqual('2021-02');
      expect(compiled.querySelector('#inputEndDate').value).toEqual('2021-04');

      expect(component.intakeData.total.value).toEqual(350);
      expect(component.generateData.total.value).toEqual(700);
      expect(component.totalData.total.value).toEqual(-350);

      expect(component.graphData.sets.length).toEqual(2);
      expect(component.graphData.sets[0].values[0]).toEqual(377);
      expect(component.graphData.yAxis).toHaveSize(5);
      expect(component.graphData.yAxis[0].value).toEqual(0);
      expect(component.graphData.yAxis[4].value).toEqual(440);
      expect(component.graphData.xAxis).toHaveSize(3);
    });
  });
});
