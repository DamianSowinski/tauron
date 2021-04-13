import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { GraphComponent } from '../../shared/graph/graph.component';
import { Graph } from '../../shared/graph/Graph';
import { ApiService } from '../../service/api.service';
import { HelperService } from '../../service/helper.service';
import { FormControl } from '@angular/forms';
import { LoginService } from '../../shared/login/login.service';
import { Title } from '@angular/platform-browser';
import { CardComponent } from '../../shared/card/card.component';
import { Card } from '../../shared/card/Card';
import { RangeUsage } from '../../model/RangeUsage';


@Component({
  selector: 'app-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss']
})
export class RangeComponent implements OnInit, AfterViewInit {
  @ViewChildren(CardComponent) cards: QueryList<CardComponent>;
  @ViewChildren(GraphComponent) graph: QueryList<GraphComponent>;

  intakeData: Card;
  generateData: Card;
  totalData: Card;
  graphData: Graph;

  inputStartDate: FormControl;
  inputEndDate: FormControl;

  startDate: Date;
  endDate: Date;
  today = new Date();

  constructor(private apiService: ApiService, private helperService: HelperService, private loginService: LoginService,
              private titleService: Title) {
    titleService.setTitle('Range usage | Energy');
  }

  ngOnInit(): void {
    this.setInputs();
    this.graphSettings();
  }

  ngAfterViewInit(): void {
    this.loginService.getLoginState().subscribe((isLogged) => {
      if (isLogged) {
        setTimeout(() => this.loadData());
      }
    });
  }

  changeStartDate(): void {
    this.startDate = HelperService.getDateFromString(this.inputStartDate.value);
    this.inputEndDate.setValue(null);
  }

  changeEndDate(): void {
    this.endDate = HelperService.getDateFromString(this.inputEndDate.value);

    this.helperService.setSelectedDate(this.startDate, 'range');
    this.helperService.setSelectedDate(this.endDate, 'range', true);

    this.loadData();
  }

  private setInputs(): void {
    this.startDate = this.helperService.getSelectedDate('range');
    this.endDate = this.helperService.getSelectedDate('range', true);

    this.inputStartDate = new FormControl(HelperService.getStringFromDate(this.startDate, 'month'));
    this.inputEndDate = new FormControl(HelperService.getStringFromDate(this.endDate, 'month'));
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

  private loadData() {
    const startDate = this.helperService.getSelectedDate('range');
    const endDate = this.helperService.getSelectedDate('range', true);

    this.cards.forEach((card) => card.isLoaded = false);
    this.graph.first.isLoaded = false;

    this.apiService.getRangeUsage(startDate, endDate).then((data) => {
      this.fillCards(data);
      this.fillGraph(data);
    });
  }

  private fillCards(data: RangeUsage) {
    const {total, day, night} = data.consume;
    const {total: totalG, day: dayG, night: nightG} = data.generate;

    this.intakeData.updateValues(total, day, night);
    this.generateData.updateValues(totalG, dayG, nightG);
    this.generateData.calculateTrends(total, day, night);
    this.totalData.updateValues(total - totalG, total, totalG);
    this.totalData.calculateMainTrends(total, totalG);

    this.cards.forEach((card) => card.refresh());
  }

  private fillGraph(data: RangeUsage) {
    const {months} = data;
    const consume = [];
    const generate = [];
    const xAxisLabels = months.map((item) => item.month.split('-').reverse().join('-'));

    months.forEach((month) => {
      consume.push(+month.consume.toFixed(2));
      generate.push(+month.generate.toFixed(2));
    });

    this.graphData.updateSetValues(0, consume);
    this.graphData.updateSetValues(1, generate);
    this.graphData.setXAxis(xAxisLabels);

    this.graph.first.updateChar();
  }
}
