import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';
import { GraphComponent } from '../shared/graph/graph.component';
import { Card } from '../shared/card/Card';
import { Graph } from '../shared/graph/Graph';
import { ApiService, EnergyMonthUsage } from '../api.service';
import { HelperService } from '../helper.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { Moment } from 'moment';

const moment = _moment;

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: 'MM.YYYY',
        },
        display: {
          dateInput: 'MM.YYYY',
          dateA11yLabel: 'LL',
          monthYearLabel: 'MMM YYYY',
          monthYearA11yLabel: 'MMMM YYYY'
        }
      }
    },
  ],
})
export class MonthComponent implements OnInit, AfterViewInit {
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
    this.selectedDate = new FormControl(moment(this.helperService.getSelectedDate('month')));
    this.graphSettings();
  }

  ngAfterViewInit() {
    setTimeout(() => this.reloadData());
  }

  changeMonth(normalizedMonth: Moment, datepicker: MatDatepicker<any>) {
    const momentDate = this.selectedDate.value;
    momentDate.month(normalizedMonth.month());

    this.helperService.setSelectedDate(momentDate.toDate(), 'month');
    this.selectedDate.setValue(momentDate);
    this.reloadData();
    datepicker.close();
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
      values: HelperService.generateDefaultValues(HelperService.daysInMonth(new Date())),
      colour: '#55D8FE'
    }, {
      title: 'Generate',
      values: HelperService.generateDefaultValues(HelperService.daysInMonth(new Date())),
      colour: '#4AD991'
    }
    ]);
  }

  private reloadData() {
    const date = this.helperService.getSelectedDate('month');

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
      this.graphData.setXAxis(HelperService.generateDaysLabel());

      this.graph.first.updateChar();
    }
  }

}
