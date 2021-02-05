import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';
import { GraphComponent } from '../shared/graph/graph.component';
import { Card } from '../shared/card/Card';
import { Graph } from '../shared/graph/Graph';
import { ApiService, EnergyRangeUsage } from '../api.service';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss']
})
export class RangeComponent implements OnInit, AfterViewInit {
  @ViewChildren(CardComponent) cards: QueryList<CardComponent>;
  @ViewChildren(GraphComponent) graph: QueryList<GraphComponent>;

  intakeData: Card;
  generateData: Card;
  totalData: Card;
  graphData: Graph;

  startDate: string;
  endDate: string;

  constructor(private apiService: ApiService, private helperService: HelperService) {
    this.intakeData = new Card('Intake', 'Day', 'Night');
    this.generateData = new Card('Generate', 'Day', 'Night');
    this.totalData = new Card('Total', 'Intake', 'Generate');
    this.totalData.setColours('#FF6565', '#4AD991');
    this.totalData.setIcons('download', 'upload');
    this.graphData = new Graph('All years summary');
    this.graphData.setXAxis(HelperService.generateRangeLabels(
      this.helperService.getSelectedDate('range'),
      this.helperService.getSelectedDate('range', true))
    );
    this.graphData.addSets([{
      title: 'Intake',
      values: HelperService.generateDefaultValues(2),
      colour: '#55D8FE'
    }, {
      title: 'Generate',
      values: HelperService.generateDefaultValues(2),
      colour: '#4AD991'
    }
    ]);
  }

  ngOnInit(): void {
    const startDate = this.helperService.getSelectedDate('range');
    const endDate = this.helperService.getSelectedDate('range', true);

    this.startDate = HelperService.getStringFromDate(startDate, 'month');
    this.endDate = HelperService.getStringFromDate(endDate, 'month');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const startDate = this.helperService.getSelectedDate('range');
      const endDate = this.helperService.getSelectedDate('range', true);

      this.apiService.getRangeUsage(startDate, endDate).then((data) => {
        this.fillCards(data);
        this.fillGraph(data);
      });
    });
  }

  changeRange(evt: Event, isEndDate: boolean = false) {
    const input = evt.target as HTMLInputElement;
    const date = HelperService.getDateFromString(input.value);

    this.helperService.setSelectedDate(date, 'range', isEndDate);
    this.cards.forEach((card) => card.isLoaded = false);

    this.graph.first.isLoaded = false;

    const startDate = this.helperService.getSelectedDate('range');
    const endDate = this.helperService.getSelectedDate('range', true);

    this.apiService.getRangeUsage(startDate, endDate).then((data) => {
      this.fillCards(data);
      this.fillGraph(data);
    });
  }

  private fillCards(data: EnergyRangeUsage) {
    if (data) {
      const {total, day, night} = data.consume;
      const {total: totalG, day: dayG, night: nightG} = data.generate;

      this.intakeData.updateValues(total, day, night);
      this.generateData.updateValues(totalG, dayG, nightG);
      this.generateData.calculateTrends(total, day, night);
      this.totalData.updateValues(total - totalG, total, totalG);
      this.totalData.calculateMainTrends(total, totalG);

      this.cards.forEach((card) => card.refresh());
    }
  }

  private fillGraph(data: EnergyRangeUsage) {
    if (data) {
      const {months} = data;
      const consume = [];
      const generate = [];
      const xAxisLabels = months.map((item) => item.month);

      for (const item of months) {
        consume.push(+item.consume.toFixed(2));
        generate.push(+item.generate.toFixed(2));
      }

      this.graphData.updateSetValues(0, consume);
      this.graphData.updateSetValues(1, generate);
      this.graphData.setXAxis(xAxisLabels);

      this.graph.first.updateChar();
    }
  }
}
