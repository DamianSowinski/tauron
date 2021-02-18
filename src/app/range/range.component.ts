import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';
import { GraphComponent } from '../shared/graph/graph.component';
import { Card } from '../shared/card/Card';
import { Graph } from '../shared/graph/Graph';
import { ApiService, EnergyRangeUsage } from '../api.service';
import { HelperService } from '../helper.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { LoginService } from '../login/login.service';

const moment = _moment;

@Component({
  selector: 'app-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss'],
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
export class RangeComponent implements OnInit, AfterViewInit {
  @ViewChildren(CardComponent) cards: QueryList<CardComponent>;
  @ViewChildren(GraphComponent) graph: QueryList<GraphComponent>;

  intakeData: Card;
  generateData: Card;
  totalData: Card;
  graphData: Graph;

  range = new FormGroup({
    start: new FormControl(moment(this.helperService.getSelectedDate('range'))),
    end: new FormControl(moment(this.helperService.getSelectedDate('range', true)))
  });

  constructor(private apiService: ApiService, private helperService: HelperService, private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.graphSettings();
  }

  ngAfterViewInit(): void {
    this.loginService.getLoginState().subscribe((isLogged) => {
      if (isLogged) {
        setTimeout(() => this.reloadData());
      }
    });
  }

  changeRange(): void {
    const {start, end} = this.range.value;

    if (!start || !end) {
      return;
    }

    this.helperService.setSelectedDate(start.toDate(), 'range');
    this.helperService.setSelectedDate(end.toDate(), 'range', true);

    this.reloadData();
  }

  private graphSettings() {
    this.intakeData = new Card('Intake', 'Day', 'Night');
    this.generateData = new Card('Generate', 'Day', 'Night');
    this.totalData = new Card('Total', 'Intake', 'Generate');
    this.totalData.setColours('#FF6565', '#4AD991');
    this.totalData.setIcons('download', 'upload');
    this.graphData = new Graph('All years summary');
    this.graphData.setXAxis(HelperService.generateRangeLabels(
      this.helperService.getSelectedDate('range'),
      this.helperService.getSelectedDate('range', true))
    );
    this.graphData.addSets([{
      title: 'Intake',
      values: HelperService.generateDefaultValues(2),
      colour: '#55D8FE'
    }, {
      title: 'Generate',
      values: HelperService.generateDefaultValues(2),
      colour: '#4AD991'
    }
    ]);
  }

  private reloadData() {
    const startDate = this.helperService.getSelectedDate('range');
    const endDate = this.helperService.getSelectedDate('range', true);

    this.cards.forEach((card) => card.isLoaded = false);
    this.graph.first.isLoaded = false;

    this.apiService.getRangeUsage(startDate, endDate).then((data) => {
      this.fillCards(data);
      this.fillGraph(data);
    });
  }

  private fillCards(data: EnergyRangeUsage) {
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

  private fillGraph(data: EnergyRangeUsage) {
    if (data) {
      const {months} = data;
      const consume = [];
      const generate = [];
      const xAxisLabels = months.map((item) => item.month);

      for (const item of months) {
        consume.push(+item.consume.toFixed(2));
        generate.push(+item.generate.toFixed(2));
      }

      this.graphData.updateSetValues(0, consume);
      this.graphData.updateSetValues(1, generate);
      this.graphData.setXAxis(xAxisLabels);

      this.graph.first.updateChar();
    }
  }
}
