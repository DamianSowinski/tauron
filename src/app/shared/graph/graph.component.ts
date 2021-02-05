import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Graph } from './Graph';

export interface ChartItem {
  title: string;
  value: number;
  colour: string;
  style: string;
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  @Input() graphData: Graph;
  @Output() changeSelectRange = new EventEmitter<number>();

  chartData: ChartItem[][] = [];
  isLoaded = false;
  isError = false;
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  private charBreakpoint = 1000;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    this.checkOrientation();
    this.initChar();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkOrientation();
  }

  updateChar() {
    this.initChar();
    this.isLoaded = true;
  }

  error(): void {
    this.isLoaded = true;
    this.isError = true;
  }

  draw() {
    this.chartData.forEach((group) => group.forEach((item) => {
      const size = 100 * item.value / this.graphData.getMaxYAxis();
      const position = this.orientation === 'horizontal' ? `height` : `width`;

      item.style = `${position}: ${size}%; background-color: ${item.colour}`;
    }));
  }

  yAxisOrientation(value: number) {
    const position = this.orientation === 'horizontal' ? 'bottom' : 'left';
    return `${position}:${value}%;`;
  }

  private initChar() {
    this.chartData = this.graphData.transformSets();
    setTimeout(() => this.draw(), 100);
  }

  private checkOrientation() {
    const width = this.el.nativeElement.clientWidth;

    if (width < this.charBreakpoint && this.orientation !== 'vertical') {
      this.orientation = 'vertical';
      this.draw();
    }

    if (width >= this.charBreakpoint && this.orientation !== 'horizontal') {
      this.orientation = 'horizontal';
      this.draw();
    }
  }
}
