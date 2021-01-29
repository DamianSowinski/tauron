import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';
import { GraphComponent } from '../shared/graph/graph.component';
import { Card } from '../shared/card/Card';
import { Graph } from '../shared/graph/Graph';
import { ApiService, EnergyMonthUsage } from '../api.service';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit, AfterViewInit {
  @ViewChildren(CardComponent) cards: QueryList<CardComponent>;
  @ViewChildren(GraphComponent) graph: QueryList<GraphComponent>;

  intakeData: Card;
  generateData: Card;
  totalData: Card;
  graphData: Graph;

  selectedDate: string;

  constructor(private apiService: ApiService) {
    this.intakeData = new Card('Intake', 'Day', 'Night');
    this.generateData = new Card('Generate', 'Day', 'Night');
    this.totalData = new Card('Total', 'Intake', 'Generate');
    this.totalData.setColours('#FF6565', '#4AD991');
    this.totalData.setIcons('download', 'upload');
    this.graphData = new Graph('Month summary');
    this.graphData.setXAxis(HelperService.generateDaysLabel());
    this.graphData.addSets([{
      title: 'Intake',
      values: HelperService.generateDefaultValues(HelperService.daysInMonth(new Date())),
      colour: '#55D8FE'
    }, {
      title: 'Generate',
      values: HelperService.generateDefaultValues(HelperService.daysInMonth(new Date())),
      colour: '#4AD991'
    }
    ]);
  }

  ngOnInit(): void {
    this.selectedDate = HelperService.getStringDate(new Date(), 'month');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.apiService.getMonthUsage(new Date()).then((data) => {
        this.fillCards(data);
        this.fillGraph(data);
      });
    });
  }

  changeDay(evt: Event) {
    const input = evt.target as HTMLInputElement;
    console.log(input.value);

    const date = HelperService.getDateFromString(input.value);


    this.cards.forEach((card) => card.isLoaded = false);
    this.graph.first.isLoaded = false;

    this.apiService.getMonthUsage(date).then((data) => {
      this.fillCards(data);
      this.fillGraph(data);
    });
  }

  private fillCards(data: EnergyMonthUsage) {
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

  private fillGraph(data: EnergyMonthUsage) {
    if (data) {
      const date = HelperService.getDateFromString(data.date);
      const {days} = data;
      const consume = [];
      const generate = [];

      for (let i = 0; i < HelperService.daysInMonth(date); i++) {
        consume.push(days[i] && days[i].consume ? +days[i].consume.toFixed(2) : 0);
        generate.push(days[i] && days[i].generate ? +days[i].generate.toFixed(2) : 0);
      }

      this.graphData.updateSetValues(0, consume);
      this.graphData.updateSetValues(1, generate);
      this.graphData.setXAxis(HelperService.generateHoursLabel());

      this.graph.first.updateChar();
    }
  }

}
