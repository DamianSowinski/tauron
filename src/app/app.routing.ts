import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DayComponent } from './day/day.component';
import { MonthComponent } from './month/month.component';
import { YearComponent } from './year/year.component';
import { RangeComponent } from './range/range.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'day', component: DayComponent},
  {path: 'month', component: MonthComponent},
  {path: 'year', component: YearComponent},
  {path: 'range', component: RangeComponent},

  // {path: 'login', component: LoginComponent, data: {animation: 'login'}},
  // {path: '**', component: PageNotFoundComponent},
];

const routerOptions: ExtraOptions = {
  // scrollPositionRestoration: 'enabled',
  // anchorScrolling: 'enabled',
  // scrollOffset: [0, 72],
};

export const AppRoutingModule = RouterModule.forRoot(routes, routerOptions);
