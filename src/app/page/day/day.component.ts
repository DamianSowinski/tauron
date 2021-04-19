import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CardComponent } from '../../shared/card/card.component';
import { GraphComponent } from '../../shared/graph/graph.component';
import { Card } from '../../shared/card/Card';
import { HelperService } from '../../service/helper.service';
import { Graph } from '../../shared/graph/Graph';
import { LoginService } from '../../shared/login/login.service';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { DayUsage } from '../../model/DayUsage';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit, AfterViewInit {
  @ViewChildren(CardComponent) cards: QueryList<CardComponent>;
  @ViewChildren(GraphComponent) graph: QueryList<GraphComponent>;

  intakeData: Card;
  generateData: Card;
  totalData: Card;
  graphData: Graph;
  inputDay: FormControl;
  yesterday: Date;

  constructor(private apiService: ApiService, private helperService: HelperService, private loginService: LoginService,
              private titleService: Title) {
    titleService.setTitle('Day usage | Energy');
    this.yesterday = HelperService.getYesterdayDate();
  }

  ngOnInit(): void {
    this.setInputDay();
    this.graphSettings();
  }

  ngAfterViewInit() {
    this.loginService.getLoginState().subscribe((isLogged) => {
      if (isLogged) {
        setTimeout(() => this.loadData());
      }
    });
  }

  changeDay() {
    const date = HelperService.getDateFromString(this.inputDay.value);

    this.helperService.setSelectedDate(date, 'day');
    this.loadData();
  }

  private setInputDay() {
    const date = this.helperService.getSelectedDate('day');
    this.inputDay = new FormControl(HelperService.getStringFromDate(date, 'day'));
  }

  private graphSettings() {
    this.intakeData = new Card('Intake', 'Day', 'Night');
    this.generateData = new Card('Generate', 'Day', 'Night');
    this.totalData = new Card('Total', 'Intake', 'Generate');
    this.totalData.setColours('#FF6565', '#4AD991');
    this.totalData.setIcons('download', 'upload');
    this.graphData = new Graph('Day summary');
    this.graphData.setXAxis(HelperService.generateHoursLabel());
    this.graphData.addSets([{
      title: 'Intake',
      values: HelperService.generateEmptyArray(24),
      colour: '#55D8FE'
    }, {
      title: 'Generate',
      values: HelperService.generateEmptyArray(24),
      colour: '#4AD991'
    }
    ]);
  }

  private loadData() {
    const date = this.helperService.getSelectedDate('day');

    this.cards.forEach((card) => card.isLoaded = false);
    this.graph.first.isLoaded = false;

    this.apiService.getDayUsage(date).then(
      (data) => {
        this.fillCards(data);
        this.fillGraph(data);
      },
      () => {
        // this.loginService.reLogin();

        this.cards.forEach((card) => card.error());
        this.graph.forEach((graph) => graph.error());
      });
  }

  private fillCards(data: DayUsage) {
    const {total, day, night} = data.consume;
    const {total: totalG, day: dayG, night: nightG} = data.generate;

    this.intakeData.updateValues(total, day, night);
    this.generateData.updateValues(totalG, dayG, nightG);
    this.generateData.calculateTrends(total, day, night);
    this.totalData.updateValues(total - totalG, total, totalG);
    this.totalData.calculateMainTrends(total, totalG);

    this.cards.forEach((card) => card.refresh());
  }

  private fillGraph(data: DayUsage) {
    const {hours} = data;
    const consume = [];
    const generate = [];

    hours.forEach((hour) => {
      consume.push(+hour.consume.toFixed(2));
      generate.push(+hour.generate.toFixed(2));
    });

    this.graphData.setXAxis(HelperService.generateHoursLabel());
    this.graphData.updateSetValues(0, consume);
    this.graphData.updateSetValues(1, generate);

    this.graph.first.updateChar();
  }
}
