import { AfterContentChecked, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAriaCurrent]'
})
export class AriaCurrentDirective implements AfterContentChecked {

  constructor(private element: ElementRef) {
  }

  ngAfterContentChecked() {
    const el = this.element.nativeElement as HTMLAnchorElement;

    if (el.classList.contains('is-active')) {
      el.setAttribute('aria-current', 'page');
    } else {
      el.removeAttribute('aria-current');
    }
  }
}
