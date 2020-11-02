import { Component, OnInit } from '@angular/core';
import { RealtimeCanvasChartOptions } from 'ngx-graph';
import { timer } from 'rxjs';
import { DataService } from '../../providers/data.service';

@Component({
  selector: 'app-demo-realtime-canvas-chart',
  templateUrl: './demo-realtime-canvas-chart.component.html',
  styleUrls: ['./demo-realtime-canvas-chart.component.sass']
})
export class DemoRealtimeCanvasChartComponent implements OnInit {
  options: RealtimeCanvasChartOptions = {
    height: 200,
    margin: { left: 40, top: 10 },
    fps: 24,
    xGrid: { tickPadding: 15, tickNumber: 10, tickFontSize: 10, tickFontWeight: 'normal', tickFontColor: '#718096' },
    yGrid: {
      min: 0,
      max: 100,
      tickNumber: 3,
      tickFormat: (v: number) => `${v}%`,
      tickPadding: 20,
      tickFontWeight: 'normal',
      tickFontColor: '#718096',
      tickFontSize: 10
    }
  };
  data = [[...this.dataService.generateRandomRealtimeData(60, 1, 0, 100)]];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    timer(0, 1000).subscribe(() => {
      this.data[0].push({ date: new Date(), value: this.dataService.randomInt(0, 100) });
      this.data[0].splice(0, 1);
    });
  }
}
