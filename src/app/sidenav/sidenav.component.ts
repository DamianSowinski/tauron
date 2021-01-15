import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

type displayMode = 'compact' | 'full';

interface SidenavItem {
  route: string;
  ico: string;
  title: string;
}


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output() closeSidebar = new EventEmitter();

  displayMode: displayMode;
  noAnimate = true;
  sidenavItems: SidenavItem[];
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.displayMode = localStorage.getItem('SidenavDisplayMode') as displayMode || 'full';

    this.sidenavItems = [
      {route: 'home', ico: 'sn-home', title: 'Home'},
      {route: 'day', ico: 'sn-day', title: 'Day'},
      {route: 'month', ico: 'sn-month', title: 'Month'},
      {route: 'year', ico: 'sn-year', title: 'Year'},
      {route: 'all', ico: 'sn-all', title: 'All'},
    ];

  }

  sideNavToggle() {
    this.noAnimate = false;
    this.displayMode = this.displayMode === 'compact' ? 'full' : 'compact';
    localStorage.setItem('SidenavDisplayMode', this.displayMode);
  }
}
