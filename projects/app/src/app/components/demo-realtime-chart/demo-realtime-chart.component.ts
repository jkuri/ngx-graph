import { Component, OnInit, OnDestroy } from '@angular/core';
import { RealtimeChartOptions } from 'ngx-graph';
import { Subscription, timer } from 'rxjs';
import { DataService } from '../../providers/data.service';
import { ThemeService } from '../../providers/theme.service';

@Component({
  selector: 'app-demo-realtime-chart',
  templateUrl: './demo-realtime-chart.component.html',
  styleUrls: ['./demo-realtime-chart.component.sass']
})
export class DemoRealtimeChartComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  realtimeChartOptions: RealtimeChartOptions;
  realtimeChartOptionsBright: RealtimeChartOptions = {
    height: 200,
    margin: { left: 40 },
    lines: [{ color: '#34B77C', lineWidth: 2, area: true, areaColor: '#34B77C', areaOpacity: 0.1 }],
    xGrid: { tickPadding: 15, tickNumber: 10, tickFontSize: 10, tickFontWeight: 'bold', tickFontColor: '#718096' },
    yGrid: {
      min: 0,
      max: 100,
      tickNumber: 5,
      tickFormat: (v: number) => `${v}%`,
      tickPadding: 20,
      tickFontWeight: 'bold',
      tickFontColor: '#718096',
      tickFontSize: 10
    },
    timeSlots: 60
  };
  realtimeChartOptionsDark: RealtimeChartOptions = {
    height: 200,
    margin: { left: 40 },
    lines: [{ color: '#FACF55', lineWidth: 3, area: true, areaColor: '#FACF55', areaOpacity: 0.2 }],
    xGrid: {
      tickPadding: 15,
      tickNumber: 5,
      color: '#BEC6E0',
      opacity: 0.05,
      tickFontColor: '#BEC6E0'
    },
    yGrid: {
      min: 0,
      max: 100,
      tickNumber: 5,
      tickFormat: (v: number) => `${v}%`,
      tickPadding: 25,
      color: '#BEC6E0',
      opacity: 0.05,
      tickFontColor: '#BEC6E0'
    },
    loadingMessage: 'Chart is initializing, please wait...',
    loadingOverlayColor: '#323B64',
    loadingTextColor: '#BEC6E0',
    timeSlots: 60
  };
  realtimeChartData = [[...this.data.generateRandomRealtimeData(60, 1, 0, 100)]];

  constructor(public data: DataService, public themeService: ThemeService) {}

  ngOnInit(): void {
    this.sub.add(
      this.themeService.theme.subscribe(theme => {
        this.realtimeChartOptions =
          theme === 'bright' ? this.realtimeChartOptionsBright : this.realtimeChartOptionsDark;
      })
    );
    this.sub.add(
      timer(0, 1000).subscribe(() => {
        this.realtimeChartData[0].push({ date: new Date(), value: this.data.randomInt(0, 100) });
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
