import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ApiService } from '../../service/api.service';
import { LoginService } from '../../shared/login/login.service';
import { Title } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/card/card.component';
import { GraphComponent } from '../../shared/graph/graph.component';
import { HelperService } from '../../service/helper.service';
import { BehaviorSubject } from 'rxjs';
import { CollectionUsage } from '../../model/CollectionUsage';
import { MOCK_DAYS_USAGE, MOCK_MONTHS_USAGE, MOCK_YEARS_USAGE } from '../../../environments/environment.test';

describe('HomeComponent', () => {
  const mockData = new CollectionUsage([MOCK_DAYS_USAGE[0]], [MOCK_MONTHS_USAGE[0]], [MOCK_YEARS_USAGE[0]]);
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let title: Title;
  let apiService: jasmine.SpyObj<ApiService>;
  let loginService: jasmine.SpyObj<LoginService>;
  let helperService: HelperService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [HomeComponent, CardComponent, GraphComponent],
      providers: [
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj('ApiService', ['getCollection'])
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
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    helperService = TestBed.inject(HelperService);
  });

  beforeEach(() => {
    loginService.getLoginState.and.returnValue(new BehaviorSubject(true));
    apiService.getCollection.and.returnValue(new Promise<CollectionUsage>(resolve => resolve(mockData)));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    return fixture.whenStable().then(() => {
      expect(loginService.getLoginState).toHaveBeenCalled();
      expect(apiService.getCollection).toHaveBeenCalled();
    });
  });

  it('should set title', () => {
    expect(title.getTitle()).toEqual('Energy');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.o-title').textContent).toContain('Short information');
  });

  it('should load default data', () => {
    return fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.intakeData.total.value).toEqual(7);
      expect(component.generateData.total.value).toEqual(28);
      expect(component.monthData.total.value).toEqual(264.02);
      expect(component.yearData.total.value).toEqual(-320.19);
    });
  });
});
