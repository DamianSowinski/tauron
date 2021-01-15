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
  set(item) {
    super.add(item);
    setTimeout(() => {
      super.delete(item);
    }, 4000);
  }
}
