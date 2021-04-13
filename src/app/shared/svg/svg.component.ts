import { Component, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'svg-ico',
  template: `
    <svg class="o-ico" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <use [attr.xlink:href]="absUrl + '#' + name + '-ico'"></use>
    </svg>
  `,
  styleUrls: []
})
export class SvgComponent {
  @Input() name: string;

  get absUrl() {
    return window.location.href.split('#')[0];
  }
}

