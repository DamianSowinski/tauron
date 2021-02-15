import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { backdropAnimation, modalAnimation } from './modalAnimation';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [backdropAnimation, modalAnimation]
})
export class ModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  @HostListener('window:click', ['$event'])
  onClick(event: Event) {
    if (this.isOpen) {
      const target = event.target as HTMLElement;
      const isBackdropClick = target.classList.contains('js-backdrop');

      if (isBackdropClick) {
        this.closeModal();
      }
    }
  }

  private closeModal() {
    this.isOpen = false;
    this.closeEvent.emit();
  }
}
