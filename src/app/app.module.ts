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
        HttpClientModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
