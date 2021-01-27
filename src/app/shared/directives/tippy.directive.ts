import { Directive, ElementRef, HostListener } from '@angular/core';
import tippy from 'tippy.js';

@Directive({
  selector: '[appTippy]'
})
export class TippyDirective {
  constructor(private el: ElementRef) {
  }

  @HostListener('mouseover')
  highlight() {
    tippy(this.el.nativeElement, {
      content: this.el.nativeElement.title,
      animation: 'shift-toward'
    });
  }

}
