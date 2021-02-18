import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ENERGY_API_URL_LOGIN } from '../../global';
import { HttpClient } from '@angular/common/http';

export interface LoginData {
  id: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginModalState = new BehaviorSubject<boolean>(true);
  private isLogged = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loginModalState.next(false);
    this.isLogged.next(!!LoginService.getSessionId());
  }

  static getSessionId(): string {
    return localStorage.getItem('sessionId') || '';
  }

  static getPointId(): string {
    return localStorage.getItem('pointId');
  }

  private static setLocalStorage(id: string, sessionId: string) {
    localStorage.setItem('pointId', id);
    localStorage.setItem('sessionId', sessionId);
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
    // this.loginModalState.next(true);
  }

  login(loginData: LoginData): Promise<null> {

    return new Promise((resolve) => {
      const {username, password, id} = loginData;
      const requestContent = {username, password};

      this.http.post<any>(ENERGY_API_URL_LOGIN, requestContent).subscribe(
        (sessionId) => {
          this.closeLoginModal();
          LoginService.setLocalStorage(id, sessionId);
          resolve();
        },
        (errors) => console.log(`%c ⚠ Warning: ${errors.details}`, `color: orange; font-weight: bold;`));
    });
  }

  logout() {
    LoginService.setLocalStorage('', '');
    window.location.reload();

  }
}
