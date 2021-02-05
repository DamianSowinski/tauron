import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import { ApiService, EnergyDayUsage, EnergyMonthUsage } from '../api.service';
import { CardComponent } from '../shared/card/card.component';
import { GraphComponent } from '../shared/graph/graph.component';
import { HelperService } from '../helper.service';
import { Card } from '../shared/card/Card';
import { Graph } from '../shared/graph/Graph';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  @ViewChildren(CardComponent) cards: QueryList<CardComponent>;
  @ViewChildren(GraphComponent) graph: QueryList<GraphComponent>;

  intakeData: Card;
  generateData: Card;
  monthData: Card;
  graphData: Graph;

  constructor(private apiService: ApiService) {
    this.intakeData = new Card('Yesterday intake', 'Day', 'Night');
    this.generateData = new Card('Yesterday generates', 'Day', 'Night');

    this.monthData = new Card('This month', 'Intake', 'Generate');
    this.monthData.setColours('#FF6565', '#4AD991');
    this.monthData.setIcons('download', 'upload');

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

  ngAfterViewInit() {
    setTimeout(() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      this.apiService.getHomeData().then(
        (data) => {
          this.fillYesterdayCards(data.days[0]);
          this.fillMonthCard(data.months[0]);
          this.fillMontGraph(data.months[0]);
        },
        () => {
          this.cards.forEach((card) => card.error());
          this.graph.forEach((graph) => graph.error());
        }
      );
    });
  }

  private fillYesterdayCards(data: EnergyDayUsage) {
    if (data) {
      const {total, day, night} = data.consume;
      const {total: totalG, day: dayG, night: nightG} = data.generate;

      this.intakeData.updateValues(total, day, night);
      this.generateData.updateValues(totalG, dayG, nightG);
      this.generateData.calculateTrends(total, day, night);

      const cards = this.cards.toArray();
      cards[0].refresh();
      cards[1].refresh();
    }
  }

  private fillMonthCard(data: EnergyMonthUsage) {
    if (data) {
      const {total} = data.consume;
      const {total: totalG} = data.generate;

      this.monthData.updateValues(total - totalG, total, totalG);
      this.monthData.calculateMainTrends(total, totalG);

      const cards = this.cards.toArray();
      cards[2].refresh();
    }
  }

  private fillMontGraph(data: EnergyMonthUsage) {
    if (data) {
      const date = HelperService.getDateFromString(data.date);
      const {days} = data;
      const consumes = [];
      const generates = [];

      for (let i = 0; i < HelperService.daysInMonth(date); i++) {
        consumes.push(days[i] && days[i].consume ? +days[i].consume.toFixed(2) : 0);
        generates.push(days[i] && days[i].generate ? +days[i].generate.toFixed(2) : 0);
      }

      this.graphData.updateSetValues(0, consumes);
      this.graphData.updateSetValues(1, generates);
      this.graphData.setXAxis(HelperService.generateDaysLabel(date));

      this.graph.first.updateChar();
    }
  }
}
