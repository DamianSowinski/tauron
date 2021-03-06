import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { LoginService } from './shared/login/login.service';
import { HelperService } from './service/helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChildren(SidenavComponent) sidenav: QueryList<SidenavComponent>;

  title = 'Energy';
  pointId = LoginService.getTokenFromLocalStorage();
  isOpenMenu = false;
  year = new Date().getFullYear();

  isOpenLoginModal$: Observable<boolean>;
  isDarkMode$: Observable<boolean>;
  isLogged$: Observable<boolean>;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 767.98px)').pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver, private loginService: LoginService, private helperService: HelperService) {
    this.isOpenLoginModal$ = loginService.getModalState();
    this.isDarkMode$ = helperService.getDarkModeState();
    this.isLogged$ = loginService.getLoginState();

  }

  ngOnInit() {
    if (!this.isLogged$) {
      this.loginService.openLoginModal();
    }

    this.isOpenMenu = this.sidenav?.first.isOpen;
  }

  openMenu(): void {
    this.sidenav.first.sideNavToggle();
    this.isOpenMenu = true;
  }

  closeMenu(): void {
    this.isOpenMenu = false;
  }

  handleLoginClick(): void {
    this.isLogged$.subscribe((isLogged) => {
      if (isLogged) {
        this.loginService.logout();
        return;
      }

      this.loginService.openLoginModal();
    });
  }

  handleDarkModeToggle() {
    this.helperService.toggleDarkModeState();
    this.helperService.setDarkModeBodyClass();
  }
}
