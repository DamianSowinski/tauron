import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { DayComponent } from './page/day/day.component';
import { MonthComponent } from './page/month/month.component';
import { YearComponent } from './page/year/year.component';
import { RangeComponent } from './page/range/range.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'day', component: DayComponent},
  {path: 'month', component: MonthComponent},
  {path: 'year', component: YearComponent},
  {path: 'range', component: RangeComponent},

  // {path: '**', component: PageNotFoundComponent},
];


const routerOptions: ExtraOptions = {
  // scrollPositionRestoration: 'enabled',
  // anchorScrolling: 'enabled',
  // scrollOffset: [0, 60],
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
