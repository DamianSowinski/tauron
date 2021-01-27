import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ApiService, EnergyDayUsage, EnergyMonthUsage } from '../api.service';
import { CardComponent, CardData } from '../shared/card/card.component';
import { GraphComponent, GraphData } from '../shared/graph/graph.component';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChildren(CardComponent) cards: QueryList<CardComponent>;
  @ViewChildren(GraphComponent) graph: QueryList<GraphComponent>;

  yesterdayIntake: CardData = {
    title: 'Yesterday intake',
    total: {
      value: 0
    },
    detail1: {
      title: 'Day',
      value: 0
    },
    detail2: {
      title: 'Night',
      value: 0
    }
  };
  yesterdayGenerate: CardData = {
    title: 'Yesterday generates',
    total: {
      value: 0
    },
    detail1: {
      title: 'Day',
      value: 0
    },
    detail2: {
      title: 'Night',
      value: 0
    }
  };
  monthSummary: CardData = {
    title: 'This month',
    total: {
      value: 0
    },
    detail1: {
      ico: 'download',
      title: 'Intake',
      value: 0,
      colour: '#FF6565'

    },
    detail2: {
      ico: 'upload',
      title: 'Generate',
      value: 0,
      colour: '#4AD991'
    }
  };
  monthDetails: GraphData = {
    title: 'Month summary',
    sets: [
      {
        title: 'Intake',
        values: HelperService.generateDefaultValues(),
        colour: '#55D8FE'
      },
      {
        title: 'Generate',
        values: HelperService.generateDefaultValues(),
        colour: '#4AD991'
      }

    ],
    xAxis: HelperService.generateLabel(),
    yMax: 15,
    breakpoint: 1300,
    selectRange: HelperService.generateMonthsRange()
  };


  constructor(private apiService: ApiService) {
  }


  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      this.apiService.getDayUsage(yesterday).then((data) => {
        this.fillYesterdayCards(data);
      });

      this.apiService.getMonthUsage().then((data) => {
        this.fillMonthCard(data);
        this.fillMontGraph(data);
      });
    });
  }

  changeMonth(select: number) {
    const date = new Date();
    date.setMonth(select - 1);
    date.setFullYear(2020);

    this.graph.first.isLoaded = false;

    this.apiService.getMonthUsage(date).then((data) => {
      this.fillMontGraph(data);
      this.graph.first.isLoaded = true;
    });
  }

  private fillYesterdayCards(data: EnergyDayUsage) {
    if (data) {
      const {total, day, night} = data.consume;
      const {total: totalG, day: dayG, night: nightG} = data.generate;

      this.yesterdayIntake.total.value = total;
      this.yesterdayIntake.detail1.value = day;
      this.yesterdayIntake.detail2.value = night;

      this.yesterdayGenerate.total.value = totalG;
      this.yesterdayGenerate.detail1.value = dayG;
      this.yesterdayGenerate.detail2.value = nightG;

      this.yesterdayGenerate.total.trend = HelperService.calculateTrend(total, totalG);
      this.yesterdayGenerate.detail1.trend = HelperService.calculateTrend(day, dayG);
      this.yesterdayGenerate.detail2.trend = HelperService.calculateTrend(night, nightG);

      const cards = this.cards.toArray();
      cards[0].refresh();
      cards[1].refresh();
    }
  }

  private fillMonthCard(data: EnergyMonthUsage) {
    if (data) {
      const {total} = data.consume;
      const {total: totalG} = data.generate;

      this.monthSummary.total.value = +(total - totalG).toFixed(2);
      this.monthSummary.detail1.value = total;
      this.monthSummary.detail2.value = totalG;
      this.monthSummary.detail2.trend = HelperService.calculateTrend(total, totalG);

      const cards = this.cards.toArray();
      cards[2].refresh();
    }
  }

  private fillMontGraph(data: EnergyMonthUsage) {
    if (data) {
      const dateParts = data.date.split('.');
      const date = new Date();
      const {days} = data;
      const consumes = [];
      const generates = [];

      date.setDate(1);
      date.setMonth(+dateParts[1] - 1);
      date.setFullYear(+dateParts[0]);

      for (let i = 0; i < HelperService.daysInMonth(date); i++) {
        consumes.push(days[i] && days[i].consume ? +days[i].consume.toFixed(2) : 0);
        generates.push(days[i] && days[i].generate ? +days[i].generate.toFixed(2) : 0);
      }

      this.monthDetails.sets[0].values = consumes;
      this.monthDetails.sets[1].values = generates;
      this.monthDetails.xAxis = HelperService.generateLabel(date);

      this.graph.first.updateChar();
    }
  }
}
