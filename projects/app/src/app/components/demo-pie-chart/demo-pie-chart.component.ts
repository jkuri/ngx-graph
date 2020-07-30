import { Component, OnInit } from '@angular/core';
import { PieChartData, PieChartSettings } from 'ngx-graph';
import { DataService } from '../../providers/data.service';

@Component({
  selector: 'app-demo-pie-chart',
  templateUrl: './demo-pie-chart.component.html',
  styleUrls: ['./demo-pie-chart.component.sass']
})
export class DemoPieChartComponent implements OnInit {
  pieChartData: PieChartData[] = [
    { id: '<5', value: this.dataService.randomInt(10000, 30000) },
    { id: '5-9', value: this.dataService.randomInt(10000, 30000) },
    { id: '10-14', value: this.dataService.randomInt(10000, 30000) },
    { id: '15-19', value: this.dataService.randomInt(10000, 30000) },
    { id: '20-24', value: this.dataService.randomInt(10000, 30000) },
    { id: '25-29', value: this.dataService.randomInt(10000, 30000) },
    { id: '30-34', value: this.dataService.randomInt(10000, 30000) }
  ];
  pieChartSettings: PieChartSettings = {
    height: 350,
    innerRadius: 0.05,
    padAngle: 4,
    borderRadius: 4
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}
}
