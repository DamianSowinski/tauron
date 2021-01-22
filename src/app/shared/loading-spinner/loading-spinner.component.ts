import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() size: 'sm' | 'md' = 'md';
  cssClass: string;
  constructor() { }


  ngOnInit(): void {
    switch (this.size) {
      case 'sm':
        this.cssClass = 'spinner spinner--sm';
        break;
      case 'md':
        this.cssClass = 'spinner';
        break;
    }
  }

}
