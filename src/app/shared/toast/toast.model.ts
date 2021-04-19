const TOAST_DURATION = 8000; // 3s longer than css setting

export interface ToastModel {
  title: string;
  desc: string;
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

    if (item.type !== Type.ERROR) {
      setTimeout(() => super.delete(item), TOAST_DURATION);
    }
  }
}
