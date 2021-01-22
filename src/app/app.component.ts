import { Component, QueryList, ViewChildren } from '@angular/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChildren(SidenavComponent) sidenav: QueryList<SidenavComponent>;

  title = 'Energy';
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  openMenu(): void {
    this.sidenav.first.sideNavToggle();

  }
}
