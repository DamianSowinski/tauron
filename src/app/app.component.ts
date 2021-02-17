import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { LoginService } from './login/login.service';
import { HelperService } from './helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChildren(SidenavComponent) sidenav: QueryList<SidenavComponent>;

  title = 'Energy';
  isOpenLoginModal: Observable<boolean>;
  isDarkMode: Observable<boolean>;
  isLogged = LoginService.isLogin();
  pointId = LoginService.getPointId();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private loginService: LoginService, private helperService: HelperService) {
    this.isOpenLoginModal = loginService.getModalState();
    this.isDarkMode = helperService.getDarkModeState();
  }

  ngOnInit() {
    if (!this.isLogged) {
      this.loginService.openLoginModal();
    }
  }

  openMenu(): void {
    this.sidenav.first.sideNavToggle();
  }

  handleLoginClick(): void {
    if (this.isLogged) {
      this.loginService.logout();
      return;
    }

    this.loginService.openLoginModal();
  }
}
