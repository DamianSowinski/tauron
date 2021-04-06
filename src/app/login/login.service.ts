import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ENERGY_API_URL_LOGIN } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../shared/toast/toast.service';

export interface LoginData {
  pointId: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginModalState = new BehaviorSubject<boolean>(true);
  private isLogged = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private toast: ToastService) {
    this.loginModalState.next(false);
    this.isLogged.next(!!LoginService.getTokenFromLocalStorage());
  }

  static getTokenFromLocalStorage(): string {
    return localStorage.getItem('token');
  }

  private static saveTokenInLocalStorage(token: string): void {
    localStorage.setItem('token', token);
  }

  private static deleteTokenInLocalStorage(): void {
    localStorage.setItem('token', '');
  }

  getModalState(): BehaviorSubject<boolean> {
    return this.loginModalState;
  }

  getLoginState(): BehaviorSubject<boolean> {
    return this.isLogged;
  }

  openLoginModal(): void {
    this.loginModalState.next(true);
  }

  closeLoginModal(): void {
    this.loginModalState.next(false);
  }

  reLogin() {
    this.isLogged.next(false);
    this.loginModalState.next(true);
  }

  login(loginData: LoginData): Promise<null> {

    return new Promise((resolve) => {
      const {username, password, pointId} = loginData;
      const requestContent = {pointId, username, password};

      this.http.post<{ token: string }>(ENERGY_API_URL_LOGIN, requestContent).subscribe(
        (data) => {
          this.closeLoginModal();
          this.toast.success('Login successfully');
          LoginService.saveTokenInLocalStorage(data.token);
          resolve();
        },
        (errors) => {
          this.toast.error(errors.error.title);
          console.log(`%c ⚠ Warning: ${errors.details}`, `color: orange; font-weight: bold;`);
        });
    });
  }

  logout() {
    LoginService.deleteTokenInLocalStorage();
    window.location.reload();
  }
}
