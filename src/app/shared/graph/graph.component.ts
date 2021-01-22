import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';

export interface GraphData {
  title: string;
  data: number[][];
  xAxis: string[];
  yMax: number;
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  @Input() graph: GraphData;

  chart: number[][] = [];
  chartStyle: string[][] = [];
  isLoaded = false;
  orientation: 'horizontal' | 'vertical' = null;

  private width = 0;
  private charBreakpoint = 992;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    this.width = this.el.nativeElement.clientWidth;
    this.initChar();
    this.setOrientation();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.width = this.el.nativeElement.clientWidth;

    if (this.width < this.charBreakpoint && this.orientation !== 'vertical') {
      this.rotateChar('vertical');
    }

    if (this.width >= this.charBreakpoint && this.orientation !== 'horizontal') {
      this.rotateChar('horizontal');
    }
  }

  initChar() {
    const setsCount = this.graph.data.length;
    const itemsCount = this.graph.xAxis.length;
    const isEqualSets = !this.graph.data.find((item) => item.length !== itemsCount);

    if (!isEqualSets) {
      console.log(`%c ⚠ Warning: graph sets are not equals`, `color: orange; font-weight: bold;`);
      return;
    }

    for (let i = 0; i < itemsCount; i++) {
      const item = [];

      for (let j = 0; j < setsCount; j++) {
        item.push(this.graph.data[j][i]);
      }

      this.chart.push(item);
    }
  }

  updateChar() {
    const setsCount = this.graph.data.length;
    const itemsCount = this.graph.xAxis.length;

    for (let i = 0; i < itemsCount; i++) {
      for (let j = 0; j < setsCount; j++) {
        this.chart[i][j] = this.graph.data[j][i];
      }
    }

    this.graph.yMax = this.calculateMaxValue();
    this.calculateStyle();
    this.isLoaded = true;
  }

  private calculateStyle() {
    const styles = [];

    this.chart.forEach((sets) => {
      const setsStyle = [];

      sets.forEach((item) => {
        const size = 100 * item / this.graph.yMax;
        const style = this.width < this.charBreakpoint ? `width:${size}%` : `height:${size}%`;
        setsStyle.push(style);
      });

      styles.push(setsStyle);

      setTimeout(() => this.chartStyle = styles, 50);
    });
  }

  private calculateMaxValue(): number {
    const yMax = this.graph.yMax;

    const maxValue = this.chart.reduce((max, item) => {
      item.forEach((value) => max = value > max ? value : max);
      return max;
    }, 0);

    return yMax > maxValue ? yMax : 5 * (Math.trunc(maxValue / 5) + 1);
  }

  private rotateChar(position: 'horizontal' | 'vertical') {
    this.chartStyle.forEach((item) => {
      for (let i = 0; i < item.length; i++) {
        if (position === 'vertical') {
          item[i] = item[i].replace('height', 'width');
        } else {
          item[i] = item[i].replace('width', 'height');
        }
      }
    });

    this.setOrientation();
  }

  private setOrientation() {
    this.orientation = this.width < this.charBreakpoint ? 'vertical' : 'horizontal';
  }
}
