import { Injectable } from '@angular/core';
import { ToastList, ToastModel, Type } from './toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastList = new ToastList();

  constructor() {
  }

  public getList(): ToastList {
    return this.toastList;
  }

  public success(title: string, desc: string = ''): void {
    const toast: ToastModel = {title, desc, type: Type.SUCCESS};
    this.toastList.set(toast);
  }

  public info(title: string, desc: string = ''): void {
    const toast: ToastModel = {title, desc, type: Type.INFO};
    this.toastList.set(toast);
  }

  public warning(title: string, desc: string = ''): void {
    const toast: ToastModel = {title, desc, type: Type.WARNING};
    this.toastList.set(toast);
  }

  public error(title: string, desc: string = ''): void {
    const toast: ToastModel = {title, desc, type: Type.ERROR};
    this.toastList.set(toast);
  }

  public clear(): void {
    this.toastList.clear();
  }
}
