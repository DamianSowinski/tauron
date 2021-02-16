import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  @ViewChildren(SidenavComponent) sidenav: QueryList<SidenavComponent>;

  title = 'Energy';
  isOpenLoginModal: Observable<boolean>;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  isLogged = LoginService.isLogin();
  pointId = LoginService.getPointId();

  constructor(private breakpointObserver: BreakpointObserver, private loginService: LoginService) {
    this.isOpenLoginModal = loginService.getModalState();
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
