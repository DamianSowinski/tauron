import { Component, OnInit } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  toastList;

  constructor(private toastService: ToastService) {
  }

  ngOnInit() {
    this.toastList = this.toastService.getList();
  }

  onHide(event) {
    const toast = event.currentTarget;
    toast.classList.add('is-hidden');
  }
}
