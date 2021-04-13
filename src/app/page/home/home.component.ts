import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CardComponent } from '../../shared/card/card.component';
import { HelperService } from '../../service/helper.service';
import { Card } from '../../shared/card/Card';
import { LoginService } from '../../shared/login/login.service';
import { Title } from '@angular/platform-browser';
import { DayUsage } from '../../model/DayUsage';
import { MonthUsage } from '../../model/MonthUsage';
import { YearUsage } from '../../model/YearUsage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  @ViewChildren(CardComponent) cards: QueryList<CardComponent>;

  intakeData: Card;
  generateData: Card;
  monthData: Card;
  yearData: Card;

  constructor(private apiService: ApiService, private loginService: LoginService, private titleService: Title) {
    titleService.setTitle('Energy');
    this.graphSettings();
  }

  ngAfterViewInit() {
    this.loginService.getLoginState().subscribe((isLogged) => {
      if (isLogged) {
        setTimeout(() => this.loadData());
      }
    });
  }

  private graphSettings() {
    this.intakeData = new Card('Yesterday intake', 'Day', 'Night');
    this.generateData = new Card('Yesterday generates', 'Day', 'Night');

    this.monthData = new Card('This month', 'Intake', 'Generate');
    this.monthData.setColours('#FF6565', '#4AD991');
    this.monthData.setIcons('download', 'upload');

    this.yearData = new Card('This year', 'Intake', 'Generate');
    this.yearData.setColours('#FF6565', '#4AD991');
    this.yearData.setIcons('download', 'upload');
  }

  private loadData() {
    const yesterday = HelperService.getYesterdayDate();

    this.cards.forEach((card) => card.isLoaded = false);

    this.apiService.getCollection([yesterday], [yesterday], [yesterday.getFullYear()]).then(
      (data) => {
        this.fillYesterdayCards(data.days[0]);
        this.fillMonthCard(data.months[0]);
        this.fillYearCard(data.years[0]);
      },
      () => {
        // this.loginService.reLogin();
        this.cards.forEach((card) => card.error());
      }
    );
  }

  private fillYesterdayCards(data: DayUsage) {
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

  private fillMonthCard(data: MonthUsage) {
    const {total} = data.consume;
    const {total: totalG} = data.generate;

    this.monthData.updateValues(total - totalG, total, totalG);
    this.monthData.calculateMainTrends(total, totalG);

    const cards = this.cards.toArray();
    cards[2].refresh();
  }

  private fillYearCard(data: YearUsage) {
    const {total} = data.consume;
    const {total: totalG} = data.generate;

    this.yearData.updateValues(total - totalG, total, totalG);
    this.yearData.calculateMainTrends(total, totalG);

    const cards = this.cards.toArray();
    cards[3].refresh();
  }
}
