import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';
import { GraphComponent } from '../shared/graph/graph.component';
import { Card } from '../shared/card/Card';
import { Graph } from '../shared/graph/Graph';
import { ApiService, EnergyAllUsage } from '../api.service';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-all-years',
  templateUrl: './all-years.component.html',
  styleUrls: ['./all-years.component.scss']
})
export class AllYearsComponent implements OnInit, AfterViewInit {
  @ViewChildren(CardComponent) cards: QueryList<CardComponent>;
  @ViewChildren(GraphComponent) graph: QueryList<GraphComponent>;

  intakeData: Card;
  generateData: Card;
  totalData: Card;
  graphData: Graph;

  constructor(private apiService: ApiService) {
    this.intakeData = new Card('Intake', 'Day', 'Night');
    this.generateData = new Card('Generate', 'Day', 'Night');
    this.totalData = new Card('Total', 'Intake', 'Generate');
    this.totalData.setColours('#FF6565', '#4AD991');
    this.totalData.setIcons('download', 'upload');
    this.graphData = new Graph('All years summary');
    this.graphData.setXAxis(HelperService.generateLastNYears(2).map((item) => item.toString()));
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

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.apiService.getAllUsage(new Date()).then((data) => {
        this.fillCards(data);
        this.fillGraph(data);
      });
    });
  }

  private fillCards(data: EnergyAllUsage) {
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

  private fillGraph(data: EnergyAllUsage) {
    if (data) {
      const {years} = data;
      const consume = [];
      const generate = [];
      const xAxisLabels = years.map((item) => item.year.toString());

      for (const item of years) {
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
