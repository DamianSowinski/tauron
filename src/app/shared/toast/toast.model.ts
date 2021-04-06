const TOAST_DURATION = 8000; // 3s longer than css setting

export interface ToastModel {
  message: string;
  type: Type;
}

export enum Type {
  SUCCESS,
  INFO,
  WARNING,
  ERROR
}

export enum Operation {
  CREATE = 'created',
  UPDATE = 'updated',
  DELETE = 'deleted',
  SEND = 'sent'
}

export enum Status {
  SUCCESS,
  ERROR
}

export class ToastList extends Set {
  set(item: ToastModel): void {
    super.add(item);
    setTimeout(() => super.delete(item), TOAST_DURATION);
  }
}
