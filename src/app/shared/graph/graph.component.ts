import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';

export interface GraphSetData {
  title: string;
  values: number[];
  colour: string;
}

export interface GraphData {
  title: string;
  sets: GraphSetData[];
  xAxis: string[];
  yMax: number;
  breakpoint?: number;
}

interface ItemData {
  title: string;
  value: number;
  style: string;
}

interface Yaxis {
  value: number;
  style: string;
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  @Input() graph: GraphData;

  chartData: ItemData[][] = [];
  yAxis: Yaxis[];
  isLoaded = false;
  orientation: 'horizontal' | 'vertical';

  private width: number;
  private charBreakpoint: number;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    this.width = this.el.nativeElement.clientWidth;
    this.charBreakpoint = this.graph.breakpoint || 990;

    this.setOrientation();
    this.initChar();
  }

  initChar() {
    const itemsCount = this.graph.xAxis.length;
    const isEqualSets = !this.graph.sets.find((item) => item.values.length !== itemsCount);

    if (!isEqualSets) {
      console.log(`%c ⚠ Warning: graph sets are not equals`, `color: orange; font-weight: bold;`);
      return;
    }

    this.graph.yMax = this.calculateMaxValue();
    this.yAxis = this.calculateYaxis();
    this.chartData = this.transformSets();
  }

  updateChar() {
    this.initChar();
    this.animateChar();
    this.isLoaded = true;
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

  private transformSets(): [][] {
    const transformedSets = [];
    const itemsCount = this.graph.xAxis.length;
    const setsCount = this.graph.sets.length;

    for (let i = 0; i < itemsCount; i++) {
      const group = [];

      for (let j = 0; j < setsCount; j++) {
        const {title, values, colour} = this.graph.sets[j];
        const style = this.calculateStyle(values, colour);

        group.push({title, value: values[i], style});
      }

      transformedSets.push(group);
    }

    return transformedSets;
  }

  private calculateYaxis(): Yaxis[] {
    const minScale = 5;
    let step = 1;
    const labels: Yaxis[] = [];

    if (this.graph.yMax > minScale) {
      step = Math.ceil(this.graph.yMax / 4);
    }

    for (let i = 0; i < 5; i++) {

      const styleSteep = 25 * i;
      const style = this.orientation === 'horizontal' ? `bottom:${styleSteep}%` : `left:${styleSteep}%`;

      labels.push({value: i * step, style});
    }

    return labels;
  }

  private calculateStyle(value, colour): string {
    const size = 100 * value / this.yAxis[this.yAxis.length - 1].value;
    let style = this.width < this.charBreakpoint ? `width:${size}%;` : `height:${size}%;`;
    style += `background-color:${colour};`;

    return style;
  }

  private calculateMaxValue(): number {
    const yMax = this.graph.yMax;

    const maxValue = this.graph.sets.reduce((max, set) => {
      set.values.forEach((value) => max = value > max ? value : max);
      return max;
    }, 0);

    return yMax > maxValue ? yMax : maxValue + 1;
  }

  private animateChar() {
    setTimeout(() => {
      this.chartData.forEach((group) => {
        group.forEach((item) => {
          const colour = this.getColourFromStyle(item.style);
          item.style = this.calculateStyle(item.value, colour);
        });
      });
    }, 100);
  }

  private rotateChar(position: 'horizontal' | 'vertical') {
    this.chartData.forEach((group) => {
      group.forEach((item) => {
        item.style = position === 'vertical' ? item.style.replace('height', 'width') : item.style.replace('width', 'height');
      });
    });

    this.setOrientation();
    this.yAxis = this.calculateYaxis();
  }

  private setOrientation() {
    this.orientation = this.width < this.charBreakpoint ? 'vertical' : 'horizontal';
  }

  private getColourFromStyle(style: string): string {
    let colour = '';

    style.split(';').forEach((property) => {
      if (-1 === property.indexOf('background-color')) {
        return;
      }

      colour = property.split(':')[1];
    });

    return colour;
  }
}
