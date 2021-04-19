import { Component } from '@angular/core';
import { ToastService } from './toast.service';
import { ToastList } from './toast.model';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  toastList: ToastList;

  constructor(private toastService: ToastService) {
    this.toastList = this.toastService.getList();
  }

  onHide($event: MouseEvent): void {
    const toast = $event.currentTarget as HTMLElement;

    if (toast) {
      toast.classList.remove('no-hide-anim');
      toast.classList.add('is-hidden');
    }
  }
}
