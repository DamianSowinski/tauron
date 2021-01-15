import { Injectable } from '@angular/core';
import { Operation, Status, ToastList, ToastModel, Type } from './toast.model';

@Injectable()
export class ToastService {
  toastList = new ToastList();

  constructor() {
  }

  public getList(): ToastList {
    return this.toastList;
  }

  public show(name: string, operation: Operation, status: Status) {
    const message = `${name} ${operation}`;

    switch (status) {
      case Status.SUCCESS:
        this.success(`${message} successfully`);
        break;
      case Status.ERROR:
        this.error(`${message} unsuccessfully`);
        break;
    }
  }

  public success(message: string) {
    const toast: ToastModel = {message, type: Type.SUCCESS};
    this.toastList.set(toast);
  }

  public info(message: string) {
    const toast: ToastModel = {message, type: Type.INFO};
    this.toastList.set(toast);
  }

  public warning(message: string) {
    const toast: ToastModel = {message, type: Type.WARNING};
    this.toastList.set(toast);
  }

  public error(message: string) {
    const toast: ToastModel = {message, type: Type.ERROR};
    this.toastList.set(toast);
  }
}
