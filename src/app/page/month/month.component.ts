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
import { MonthUsage } from '../../model/MonthUsage';

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
  inputMonth: FormControl;
  today = new Date();

  constructor(private apiService: ApiService, private helperService: HelperService, private loginService: LoginService,
              private titleService: Title) {
    titleService.setTitle('Month usage | Energy');
  }

  ngOnInit(): void {
    this.setInputMonth();
    this.graphSettings();
  }

  ngAfterViewInit() {
    this.loginService.getLoginState().subscribe((isLogged) => {
      if (isLogged) {
        setTimeout(() => this.loadData());
      }
    });
  }

  changeMonth() {
    const month = HelperService.getDateFromString(this.inputMonth.value);

    this.helperService.setSelectedDate(month, 'month');
    this.loadData();
  }

  private setInputMonth() {
    const month = this.helperService.getSelectedDate('month');
    this.inputMonth = new FormControl(HelperService.getStringFromDate(month, 'month'));
  }

  private graphSettings() {
    this.intakeData = new Card('Intake', 'Day', 'Night');
    this.generateData = new Card('Generate', 'Day', 'Night');
    this.totalData = new Card('Total', 'Intake', 'Generate');
    this.totalData.setColours('#FF6565', '#4AD991');
    this.totalData.setIcons('download', 'upload');
    this.graphData = new Graph('Month summary');
    this.graphData.setXAxis(HelperService.generateDaysLabel());
    this.graphData.addSets([{
      title: 'Intake',
      values: HelperService.generateEmptyArray(HelperService.daysInMonth(new Date())),
      colour: '#55D8FE'
    }, {
      title: 'Generate',
      values: HelperService.generateEmptyArray(HelperService.daysInMonth(new Date())),
      colour: '#4AD991'
    }
    ]);
  }

  private loadData() {
    const date = this.helperService.getSelectedDate('month');

    this.cards.forEach((card) => card.isLoaded = false);
    this.graph.first.isLoaded = false;

    this.apiService.getMonthUsage(date).then(
      (data) => {
        this.fillCards(data);
        this.fillGraph(data);
      },
      () => {
        this.cards.forEach((card) => card.error());
        this.graph.forEach((graph) => graph.error());
      });
  }

  private fillCards(data: MonthUsage) {
    const {total, day, night} = data.consume;
    const {total: totalG, day: dayG, night: nightG} = data.generate;

    this.intakeData.updateValues(total, day, night);
    this.generateData.updateValues(totalG, dayG, nightG);
    this.generateData.calculateTrends(total, day, night);
    this.totalData.updateValues(total - totalG, total, totalG);
    this.totalData.calculateMainTrends(total, totalG);

    this.cards.forEach((card) => card.refresh());
  }

  private fillGraph(data: MonthUsage) {
    const {date, days} = data;
    const consume = [];
    const generate = [];

    days.forEach((day) => {
      consume.push(+day.consume.toFixed(2));
      generate.push(+day.generate.toFixed(2));
    });

    this.graphData.updateSetValues(0, consume);
    this.graphData.updateSetValues(1, generate);
    this.graphData.setXAxis(HelperService.generateDaysLabel(date));

    this.graph.first.updateChar();
  }
}
