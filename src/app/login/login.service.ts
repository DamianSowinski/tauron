import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ENERGY_API_URL_LOGIN } from '../../global';
import { HttpClient } from '@angular/common/http';

export interface TauronLogin {
  id: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginModalState = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) {
    this.loginModalState.next(false);
  }

  static getSessionId(): string {
    return localStorage.getItem('sessionId') || '';
  }

  static getTauronId(): string {
    return localStorage.getItem('tauronId');
  }

  private static setLocalStorage(id: string, sessionId: string) {
    localStorage.setItem('tauronId', id);
    localStorage.setItem('sessionId', sessionId);
  }

  getModalState(): BehaviorSubject<boolean> {
    return this.loginModalState;
  }

  setModalState(isOpen: boolean): void {
    this.loginModalState.next(isOpen);
  }

  login(loginData: TauronLogin): Promise<null> {

    return new Promise((resolve) => {

      const {username, password, id} = loginData;
      const requestContent = {username, password};

      this.http.post<any>(ENERGY_API_URL_LOGIN, requestContent).subscribe(
        (sessionId) => {
          LoginService.setLocalStorage(id, sessionId);
          resolve();
        },
        (errors) => console.log(`%c ⚠ Warning: ${errors.details}`, `color: orange; font-weight: bold;`));
    });
  }
}
