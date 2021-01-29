import { Component, Input, OnInit } from '@angular/core';
import { Card } from './Card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() cardData: Card;
  barsWidth = [1, 1];
  barsStyle = [null, null];
  isLoaded = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  refresh(): void {
    this.calculateSize();
    this.setGraphStyle();
    this.isLoaded = true;
  }

  private calculateSize() {
    const value1 = this.cardData.detail1.value;
    const value2 = this.cardData.detail2.value;

    if (value1 === 0 && value2 === 0) {
      this.barsWidth[0] = 0;
      this.barsWidth[1] = 0;
    } else if (value1 > value2) {
      this.barsWidth[0] = 100;
      this.barsWidth[1] = Math.floor(100 * value2 / value1);
    } else {
      this.barsWidth[0] = Math.floor(100 * value1 / value2);
      this.barsWidth[1] = 100;
    }
  }

  private setGraphStyle() {
    const colour1 = this.cardData.detail1.colour;
    const colour2 = this.cardData.detail2.colour;

    this.barsStyle[0] = `height:${this.barsWidth[0]}px; background-color:${colour1};`;
    this.barsStyle[1] = `height:${this.barsWidth[1]}px; background-color:${colour2};`;
  }
}
