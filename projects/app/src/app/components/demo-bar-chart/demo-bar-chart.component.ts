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
    margin: { top: 20, right: 0, bottom: 30, left: 80 },
    yGrid: {
      min: 0,
      max: 25000,
      tickFontSize: 11,
      tickFormat: (v: number | Date) => `€ ${v}`,
      tickPadding: 40,
      tickNumber: 6,
      tickFontWeight: 600
    },
    xGrid: { tickPadding: 10, tickFontSize: 11, color: '#ffffff', tickFontWeight: 600 },
    colors: ['#3F87F5'],
    borderRadius: 5,
    padding: 0.3
  };
  data: BarChartData[];

  constructor(private dataService: DataService) {
    this.data = [
      'Gray',
      'Red',
      'Orange',
      'Yellow',
      'Green',
      'Teal',
      'Blue',
      'Indigo',
      'Purple',
      'Pink',
      'Black',
      'White',
      'Cyan',
      'Magenta'
    ].map(color => ({ id: color, y: this.dataService.randomInt(10000, 22000) }));
  }

  ngOnInit(): void {}
}
