import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { GraphComponent } from '../../shared/graph/graph.component';
import { HelperService } from '../../service/helper.service';
import { Graph } from '../../shared/graph/Graph';
import { LoginService } from '../../shared/login/login.service';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CardComponent } from '../../shared/card/card.component';
import { Card } from '../../shared/card/Card';
import { YearUsage } from '../../model/YearUsage';
import { YEAR_DROP_DOWN_LENGTH } from '../../../environments/environment';

@Component({
  selector: 'app-year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.scss']
})
export class YearComponent implements OnInit, AfterViewInit {
  @ViewChildren(CardComponent) cards: QueryList<CardComponent>;
  @ViewChildren(GraphComponent) graph: QueryList<GraphComponent>;

  intakeData: Card;
  generateData: Card;
  totalData: Card;
  graphData: Graph;
  currentYear = new Date().getFullYear();
  selectYears = [];
  selectedDate: FormControl;

  constructor(private apiService: ApiService, private helperService: HelperService, private loginService: LoginService,
              private titleService: Title) {
    titleService.setTitle('Year usage | Energy');
  }

  ngOnInit(): void {
    this.setInputYear();
    this.graphSettings();
  }

  ngAfterViewInit() {
    this.loginService.getLoginState().subscribe((isLogged) => {
      if (isLogged) {
        setTimeout(() => this.loadData());
      }
    });
  }

  changeYear() {
    const date = HelperService.getDateFromString(this.selectedDate.value.toString());

    this.helperService.setSelectedDate(date, 'year');
    this.loadData();
  }

  private setInputYear() {
    const year = this.helperService.getSelectedDate('year').getFullYear();
    this.selectedDate = new FormControl(year);

    for (let i = 0; i < YEAR_DROP_DOWN_LENGTH; i++) {
      this.selectYears.push(this.currentYear - i);
    }
  }

  private graphSettings() {
    this.intakeData = new Card('Intake', 'Day', 'Night');
    this.generateData = new Card('Generate', 'Day', 'Night');
    this.totalData = new Card('Total', 'Intake', 'Generate');
    this.totalData.setColours('#FF6565', '#4AD991');
    this.totalData.setIcons('download', 'upload');
    this.graphData = new Graph('Year summary');
    this.graphData.setXAxis(HelperService.generateDaysLabel());
    this.graphData.addSets([{
      title: 'Intake',
      values: HelperService.generateDefaultValues(12),
      colour: '#55D8FE'
    }, {
      title: 'Generate',
      values: HelperService.generateDefaultValues(12),
      colour: '#4AD991'
    }
    ]);
  }

  private loadData() {
    const year = this.helperService.getSelectedDate('year').getFullYear();

    this.cards.forEach((card) => card.isLoaded = false);
    this.graph.first.isLoaded = false;

    this.apiService.getYearUsage(year).then((data) => {
      this.fillCards(data);
      this.fillGraph(data);
    });
  }

  private fillCards(data: YearUsage) {
    const {total, day, night} = data.consume;
    const {total: totalG, day: dayG, night: nightG} = data.generate;

    this.intakeData.updateValues(total, day, night);
    this.generateData.updateValues(totalG, dayG, nightG);
    this.generateData.calculateTrends(total, day, night);
    this.totalData.updateValues(total - totalG, total, totalG);
    this.totalData.calculateMainTrends(total, totalG);

    this.cards.forEach((card) => card.refresh());
  }

  private fillGraph(data: YearUsage) {
    const {months} = data;
    const consume = [];
    const generate = [];

    months.forEach((month) => {
      consume.push(+month.consume.toFixed(2));
      generate.push(+month.generate.toFixed(2));
    });

    this.graphData.updateSetValues(0, consume);
    this.graphData.updateSetValues(1, generate);
    this.graphData.setXAxis(HelperService.generateMonthsLabel());

    this.graph.first.updateChar();
  }
}
