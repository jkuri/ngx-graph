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
    fps: 30
  };
  data = [[...this.dataService.generateRandomRealtimeData(60, 1, 0, 100)]];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    timer(0, 1000).subscribe(() => {
      // this.data[0].splice(0, 1);
      this.data[0].push({ date: new Date(), value: this.dataService.randomInt(0, 100) });
      // this.data[0].splice(0, 1);
    });
  }
}
