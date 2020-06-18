import { Component, OnInit, OnDestroy } from '@angular/core';
import { RealtimeChartSettings } from 'ngx-graph';
import { interval, Subscription } from 'rxjs';
import { timeInterval } from 'rxjs/operators';
import { DataService } from '../../providers/data.service';
import { ThemeService } from '../../providers/theme.service';

@Component({
  selector: 'app-demo-realtime-chart',
  templateUrl: './demo-realtime-chart.component.html',
  styleUrls: ['./demo-realtime-chart.component.sass']
})
export class DemoRealtimeChartComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  realtimeChartOptions: RealtimeChartSettings;
  realtimeChartOptionsBright: RealtimeChartSettings = {
    height: 200,
    margin: { left: 40 },
    lines: [
      { color: '#34B77C', lineWidth: 3, area: true, areaColor: '#34B77C', areaOpacity: .2 }
    ],
    xGrid: { tickPadding: 15, tickNumber: 5 },
    yGrid: { min: 0, max: 100, tickNumber: 5, tickFormat: (v: number) => `${v}%`, tickPadding: 25 }
  };
  realtimeChartOptionsDark: RealtimeChartSettings = {
    height: 200,
    margin: { left: 40 },
    lines: [
      { color: '#FACF55', lineWidth: 3, area: true, areaColor: '#FACF55', areaOpacity: .5 }
    ],
    xGrid: {
      tickPadding: 15,
      tickNumber: 5,
      color: '#BEC6E0',
      opacity: .05,
      tickFontColor: '#BEC6E0'
    },
    yGrid: {
      min: 0,
      max: 100,
      tickNumber: 5,
      tickFormat: (v: number) => `${v}%`,
      tickPadding: 25,
      color: '#BEC6E0',
      opacity: .05,
      tickFontColor: '#BEC6E0'
    }
  };
  realtimeChartData = [[{ date: new Date(), value: 40 }]];

  constructor(public data: DataService, public themeService: ThemeService) { }

  ngOnInit(): void {
    this.sub.add(
      this.themeService.theme
        .subscribe(theme => {
          this.realtimeChartOptions = theme === 'bright' ? this.realtimeChartOptionsBright : this.realtimeChartOptionsDark;
        })
    );
    this.sub.add(
      interval(1000)
        .pipe(timeInterval())
        .subscribe(() => {
          this.realtimeChartData[0].push({ date: new Date(), value: this.data.randomInt(0, 100) });
        })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
