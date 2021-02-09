import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app.routing';
import { HomeComponent } from './home/home.component';
import { DayComponent } from './day/day.component';
import { MonthComponent } from './month/month.component';
import { YearComponent } from './year/year.component';
import { RangeComponent } from './range/range.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    HomeComponent,
    DayComponent,
    MonthComponent,
    YearComponent,
    RangeComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    MatInputModule,
    MatMomentDateModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'PL'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
