import { Component, Input, OnInit } from '@angular/core';

export interface CardData {
  title: string;
  total?: {
    value?: number;
    trend?: number;
  };
  detail1?: {
    ico?: string;
    title?: string;
    value?: number;
    trend?: number;
    colour?: string;
  };
  detail2?: {
    ico?: string;
    title?: string;
    value?: number;
    trend?: number;
    colour?: string;
  };
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() data: CardData;
  graphValue = [1, 1];
  graphStyle = [null, null];
  isLoaded = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  refresh() {
    const value1 = this.data.detail1.value;
    const value2 = this.data.detail2.value;


    if (value1 === 0 && value2 === 0) {
      this.graphValue[0] = 0;
      this.graphValue[1] = 0;
    } else if (value1 > value2) {
      this.graphValue[0] = 100;
      this.graphValue[1] = Math.floor(100 * value2 / value1);

    } else {
      this.graphValue[0] = Math.floor(100 * value1 / value2);
      this.graphValue[1] = 100;
    }

    this.setGraphStyle();
    this.isLoaded = true;
  }

  private setGraphStyle() {
    const colour1 = this.data.detail1.colour || '#FFCA83';
    const colour2 = this.data.detail2.colour || '#55D8FE';

    this.graphStyle[0] = `height:${this.graphValue[0]}px; background-color:${colour1};`;
    this.graphStyle[1] = `height:${this.graphValue[1]}px; background-color:${colour2};`;
  }
}
