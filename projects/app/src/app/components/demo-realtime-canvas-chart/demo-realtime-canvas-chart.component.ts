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
  timeSlots = 60;
  options: RealtimeCanvasChartOptions = {
    height: 200,
    margin: { left: 40, top: 10 },
    fps: 60,
    timeSlots: this.timeSlots,
    xGrid: {
      tickPadding: 15,
      tickNumber: 10,
      tickFontSize: 10,
      tickFontWeight: 'normal',
      tickFontColor: '#718096',
      color: '#EAEDF3',
      opacity: 0.5
    },
    yGrid: {
      min: 0,
      max: 100,
      color: '#EAEDF3',
      opacity: 0.5,
      tickNumber: 4,
      tickFormat: (v: number) => `${v}%`,
      tickPadding: 20,
      tickFontWeight: 'normal',
      tickFontColor: '#718096',
      tickFontSize: 10
    },
    lines: [{ color: '#34B77C', opacity: 1, area: true, areaColor: '#34B77C', areaOpacity: 0.1, curve: 'basis' }]
  };
  data = [[]];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.data = [[...this.dataService.generateRandomRealtimeData(120, 1, 0, 100)]];
    timer(0, 2000).subscribe(() => {
      this.data[0].push({ date: new Date(), value: this.dataService.randomInt(0, 100) });
    });
  }
}
