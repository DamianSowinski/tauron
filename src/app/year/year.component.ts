import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ApiService, EnergyYearUsage } from '../api.service';
import { CardComponent } from '../shared/card/card.component';
import { GraphComponent } from '../shared/graph/graph.component';
import { Card } from '../shared/card/Card';
import { HelperService } from '../helper.service';
import { Graph } from '../shared/graph/Graph';
import { LoginService } from '../login/login.service';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';

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
  selectedDate: FormControl;
  currentYear = new Date().getFullYear();

  constructor(private apiService: ApiService, private helperService: HelperService, private loginService: LoginService,
              private titleService: Title) {
    titleService.setTitle('Year usage | Energy');
  }

  ngOnInit(): void {
    const year = this.helperService.getSelectedDate('year').getFullYear();

    this.selectedDate = new FormControl(year);
    this.graphSettings();
  }

  ngAfterViewInit() {
    this.loginService.getLoginState().subscribe((isLogged) => {
      if (isLogged) {
        setTimeout(() => this.reloadData());
      }
    });
  }

  changeYear() {
    const date = HelperService.getDateFromString(this.selectedDate.value.toString());

    this.helperService.setSelectedDate(date, 'year');
    this.reloadData();
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

  private reloadData() {
    const date = this.helperService.getSelectedDate('year');

    this.cards.forEach((card) => card.isLoaded = false);
    this.graph.first.isLoaded = false;

    this.apiService.getYearUsage(date).then((data) => {
      this.fillCards(data);
      this.fillGraph(data);
    });
  }

  private fillCards(data: EnergyYearUsage) {
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

  private fillGraph(data: EnergyYearUsage) {
    if (data) {
      const {months} = data;
      const consume = [];
      const generate = [];

      for (let i = 0; i < 12; i++) {
        consume.push(months[i] && months[i].consume ? +months[i].consume.toFixed(2) : 0);
        generate.push(months[i] && months[i].generate ? +months[i].generate.toFixed(2) : 0);
      }

      this.graphData.updateSetValues(0, consume);
      this.graphData.updateSetValues(1, generate);
      this.graphData.setXAxis(HelperService.generateMonthsLabel());

      this.graph.first.updateChar();
    }
  }
}
