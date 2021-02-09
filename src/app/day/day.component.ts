import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ApiService, EnergyDayUsage } from '../api.service';
import { CardComponent } from '../shared/card/card.component';
import { GraphComponent } from '../shared/graph/graph.component';
import { Card } from '../shared/card/Card';
import { HelperService } from '../helper.service';
import { Graph } from '../shared/graph/Graph';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { Moment } from 'moment';

const moment = _moment;

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: 'DD.MM.YYYY',
        },
        display: {
          dateInput: 'DD.MM.YYYY',
          dateA11yLabel: 'LL',
          monthYearLabel: 'MMM YYYY',
          monthYearA11yLabel: 'MMMM YYYY'
        }
      }
    },
  ],
})
export class DayComponent implements OnInit, AfterViewInit {
  @ViewChildren(CardComponent) cards: QueryList<CardComponent>;
  @ViewChildren(GraphComponent) graph: QueryList<GraphComponent>;

  intakeData: Card;
  generateData: Card;
  totalData: Card;
  graphData: Graph;
  selectedDate: FormControl;

  constructor(private apiService: ApiService, private helperService: HelperService) {
  }

  ngOnInit(): void {
    this.selectedDate = new FormControl(moment(this.helperService.getSelectedDate('day')));
    this.graphSettings();
  }

  ngAfterViewInit() {
    setTimeout(() => this.reloadData());
  }

  changeDay() {
    const momentDate = this.selectedDate.value as Moment;

    this.helperService.setSelectedDate(momentDate.toDate(), 'day');
    this.reloadData();
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
      values: HelperService.generateDefaultValues(24),
      colour: '#55D8FE'
    }, {
      title: 'Generate',
      values: HelperService.generateDefaultValues(24),
      colour: '#4AD991'
    }
    ]);
  }

  private reloadData() {
    const date = this.helperService.getSelectedDate('day');

    this.cards.forEach((card) => card.isLoaded = false);
    this.graph.first.isLoaded = false;

    this.apiService.getDayUsage(date).then((data) => {
      this.fillCards(data);
      this.fillGraph(data);
    });
  }

  private fillCards(data: EnergyDayUsage) {
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

  private fillGraph(data: EnergyDayUsage) {
    if (data) {
      const {hours} = data;
      const consume = [];
      const generate = [];

      for (let i = 0; i < 24; i++) {
        consume.push(hours[i] && hours[i].consume ? +hours[i].consume.toFixed(2) : 0);
        generate.push(hours[i] && hours[i].generate ? +hours[i].generate.toFixed(2) : 0);
      }

      this.graphData.setXAxis(HelperService.generateHoursLabel());
      this.graphData.updateSetValues(0, consume);
      this.graphData.updateSetValues(1, generate);

      this.graph.first.updateChar();
    }
  }
}
