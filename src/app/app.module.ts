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
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    HomeComponent,
    DayComponent,
    MonthComponent,
    YearComponent,
    RangeComponent,
    LoginComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
