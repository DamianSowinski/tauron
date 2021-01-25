import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ApiService, EnergyDayUsage, EnergyMonthUsage } from '../api.service';
import { CardComponent, CardData } from '../shared/card/card.component';
import { GraphComponent, GraphData } from '../shared/graph/graph.component';
import { delay } from 'rxjs/operators';

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
      value: 0
    },
    detail2: {
      value: 0
    }
  };
  yesterdayGenerate: CardData = {
    title: 'Yesterday generates',
    total: {
      value: 0
    },
    detail1: {
      value: 0
    },
    detail2: {
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
      value: 0,
      colour: '#FF6565'

    },
    detail2: {
      ico: 'upload',
      value: 0,
      colour: '#4AD991'
    }
  };
  monthDetails: GraphData = {
    title: 'Month summary',
    sets: [
      {
        title: 'Intake',
        values: HomeComponent.generateDefaultValues(),
        colour: '#55D8FE'
      },
      {
        title: 'Generate',
        values: HomeComponent.generateDefaultValues(),
        colour: '#4AD991'
      }

    ],
    xAxis: HomeComponent.generateLabel(),
    yMax: 15,
    breakpoint: 1300
  };

  constructor(private apiService: ApiService) {
  }

  private static calculateTrend(a: number, b: number): number {
    return +(100 * (b - a) / a).toFixed(2);
  }

  private static daysInMonth(month, year): number { // Use 1 for January, 2 for February, etc.
    return new Date(year, month, 0).getDate();
  }

  private static generateDefaultValues(): number[] {
    const size = HomeComponent.daysInMonth(1, 2021);
    const defaultVal = new Array(size);

    return defaultVal.fill(0, 0, size);
  }

  private static generateLabel(): string[] {
    const label = [];
    for (let i = 0; i < HomeComponent.daysInMonth(1, 2021); i++) {
      label.push((i + 1).toString());
    }

    return label;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.apiService.mockGetYesterdayUsage()
        .pipe(
          delay(500)
        )
        .subscribe((data) => {
          this.fillYesterdayCards(data);
        });

      this.apiService.mockGetMontUsage()
        .pipe(
          delay(800)
        )
        .subscribe((data) => {
          this.fillMonthCard(data);
          this.fillMontGraph(data);
        });
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

      this.yesterdayGenerate.total.trend = HomeComponent.calculateTrend(total, totalG);
      this.yesterdayGenerate.detail1.trend = HomeComponent.calculateTrend(day, dayG);
      this.yesterdayGenerate.detail2.trend = HomeComponent.calculateTrend(night, nightG);

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
      this.monthSummary.detail2.trend = HomeComponent.calculateTrend(total, totalG);

      const cards = this.cards.toArray();
      cards[2].refresh();
    }
  }

  private fillMontGraph(data: EnergyMonthUsage) {
    if (data) {
      const {days} = data;
      const consumes = [];
      const generates = [];

      for (let i = 0; i < HomeComponent.daysInMonth(1, 2021); i++) {
        consumes.push(days[i] && days[i].consume ? days[i].consume : 0);
        generates.push(days[i] && days[i].generate ? days[i].generate : 0);
      }

      this.monthDetails.sets[0].values = consumes;
      this.monthDetails.sets[1].values = generates;
      this.graph.first.updateChar();
    }
  }

}
