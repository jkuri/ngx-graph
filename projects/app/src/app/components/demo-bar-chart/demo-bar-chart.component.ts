import { Component, OnInit } from '@angular/core';
import { BarChartData, BarChartOptions } from 'ngx-graph';
import { DataService } from '../../providers/data.service';

@Component({
  selector: 'app-demo-bar-chart',
  templateUrl: './demo-bar-chart.component.html',
  styleUrls: ['./demo-bar-chart.component.sass']
})
export class DemoBarChartComponent implements OnInit {
  options: BarChartOptions = {
    height: 300,
    margin: { top: 10, right: 30, bottom: 30, left: 40 },
    yGrid: {
      min: 0,
      // max: 80,
      tickFontSize: 11,
      tickFormat: (v: number | Date) => `€ ${v}`,
      tickPadding: 20,
      tickNumber: 6,
      tickFontWeight: 600
    },
    xGrid: { tickPadding: 10, tickFontSize: 11, color: '#ffffff', tickFontWeight: 600 },
    colors: ['#9ae6b4', '#38a169', '#68d391', '#2f855a', '#48bb78'],
    borderRadius: 5,
    padding: 0.1,
    tooltip: true,
    transitions: true
  };
  data: BarChartData;

  constructor(private dataService: DataService) {
    this.data = this.generateBarData();
  }

  ngOnInit(): void {}

  private generateBarData(): BarChartData {
    const cat = ['Student', 'Liberal Profession', 'Salaried Stuff', 'Employee', 'E1', 'E2', 'E3', 'E4'];
    const id = ['Not at all', 'Not very much'];

    return [...cat].map(c => {
      return { category: c, values: [...id].map(i => ({ id: i, value: this.dataService.randomInt(10, 50) })) };
    });
  }
}
