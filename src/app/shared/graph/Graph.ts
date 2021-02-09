import { ChartItem } from './graph.component';

interface Yaxis {
  value: number;
  position: number;
}

interface Set {
  title: string;
  values: number[];
  colour: string;
}

export class Graph {
  title: string;
  sets: Set[];
  xAxis: string[];
  yAxis: Yaxis[];
  yMax: number;

  constructor(title: string) {
    this.title = title;
    this.sets = [];
    this.xAxis = [];
    this.yAxis = [];
    this.yMax = 1;
  }

  setXAxis(values: string[]): void {
    this.xAxis = values;
  }

  addSets(sets: Set[]): void {
    sets.forEach((set) => this.sets.push(set));
    this.calculateYMax();
    this.calculateYaxis();
  }

  updateSetValues(setIndex: number, values: number[]): void {
    if (!this.sets[setIndex]) {
      return;
    }

    this.sets[setIndex].values = values;
    this.calculateYMax();
    this.calculateYaxis();
  }

  getMaxYAxis(): number {
    return +this.yAxis[this.yAxis.length - 1].value;
  }

  transformSets(): ChartItem[][] {
    const transformedSets = [];
    const itemsCount = this.xAxis.length;
    const setsCount = this.sets.length;

    for (let i = 0; i < itemsCount; i++) {
      const group = [];

      for (let j = 0; j < setsCount; j++) {
        const {title, values, colour} = this.sets[j];
        group.push({title, value: values[i], colour});
      }

      transformedSets.push(group);
    }

    return transformedSets;
  }

  private calculateYMax(): void {
    const maxValue = this.sets.reduce((acc, set) => {
      set.values.forEach((value) => acc = value > acc ? value : acc);
      return acc;
    }, 0);

    this.yMax = Math.ceil(maxValue);
  }

  private calculateYaxis(): void {
    const max = this.yMax;

    let step = 0.25;
    this.yAxis = [];

    if (max > 1) {
      step = 0.5;
    }

    if (max > 2) {
      step = 0.75;
    }

    if (max > 3 ) {
      step = Math.ceil(max / 4);
    }

    if (max > 25 ) {
      step = Math.ceil(max / 4 / 5 ) * 5;
    }

    for (let i = 0; i < 5; i++) {
      this.yAxis.push({value: i * step, position: 25 * i});
    }
  }
}
