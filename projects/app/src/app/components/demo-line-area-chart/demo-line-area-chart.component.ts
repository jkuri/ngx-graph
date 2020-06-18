import { Component, OnInit, OnDestroy } from '@angular/core';
import { LineChartData, LineChartOptions } from 'ngx-graph';
import { format } from 'd3-format';
import { DataService } from '../../providers/data.service';
import { ThemeService } from '../../providers/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-demo-line-area-chart',
  templateUrl: './demo-line-area-chart.component.html',
  styleUrls: ['./demo-line-area-chart.component.sass']
})
export class DemoLineAreaChartComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  lineChartOptions: LineChartOptions;
  lineChartOptionsBright: LineChartOptions = {
    height: 300,
    margin: { top: 20, right: 40, bottom: 80, left: 60 },
    yScale: { min: 0, max: 3000 },
    xGrid: {
      opacity: .4,
      textColor: '#333'
    },
    yGrid: {
      tickPadding: 13,
      tickFormat: (num: number) => format('~s')(num) + ' €',
      tickTextAnchor: 'end',
      tickNumber: 5,
      opacity: .4,
      textColor: '#333'
    },
    transitions: true,
    transitionDuration: 400,
    legend: true,
    legendPosition: 'bottom',
    legendMargin: { top: 0, right: 0, left: 0, bottom: 0 },
    initialTransition: false,
    interaction: {
      axisLine: true,
      axisLineSize: 4,
      axisLineColor: '#eef0f7',
      tooltip: true,
    }
  };
  lineChartOptionsDark: LineChartOptions = {
    height: 300,
    margin: { top: 20, right: 40, bottom: 80, left: 60 },
    yScale: { min: 0, max: 3000 },
    xGrid: {
      color: '#BEC6E0',
      opacity: .05,
      textColor: '#BEC6E0'
    },
    yGrid: {
      tickPadding: 13,
      tickFormat: (num: number) => format('~s')(num) + ' €',
      tickTextAnchor: 'end',
      tickNumber: 5,
      color: '#BEC6E0',
      opacity: .05,
      textColor: '#BEC6E0'
    },
    transitions: true,
    transitionDuration: 400,
    legend: true,
    legendPosition: 'bottom',
    legendMargin: { top: 0, right: 0, left: 0, bottom: 0 },
    initialTransition: false,
    interaction: {
      enable: false
    }
  };

  lineChartData: LineChartData[];
  lineChartDataBright = [
    new LineChartData({
      id: 'progress',
      data: this.data.generateRandomDateValues(10, 2000, 2900),
      area: true,
      areaOpacity: .4,
      curve: 'linear',
      markers: true,
      color: '#FACF55',
      areaColor: '#FACF55',
      markerColor: '#FACF55',
      lineSize: 3
    }),
    new LineChartData({
      id: 'income',
      data: this.data.generateRandomDateValues(10, 1200, 1900),
      area: true,
      areaOpacity: .4,
      curve: 'linear',
      markers: true,
      lineSize: 3
    }),
    new LineChartData({
      id: 'expenses',
      data: this.data.generateRandomDateValues(10, 400, 950),
      area: true,
      areaOpacity: .4,
      curve: 'linear',
      markers: true,
      color: '#34B77C',
      areaColor: '#34B77C',
      markerColor: '#34B77C',
      lineSize: 3
    })
  ];
  lineChartDataDark = [
    new LineChartData({
      id: 'progress',
      data: this.data.generateRandomDateValues(10, 2000, 2900),
      area: true,
      areaOpacity: 1,
      curve: 'cardinal',
      markers: false,
      color: '#FACF55',
      areaColor: '#FACF55',
      markerColor: '#FACF55',
      lineSize: 3
    }),
    new LineChartData({
      id: 'income',
      data: this.data.generateRandomDateValues(10, 1200, 1900),
      area: true,
      areaOpacity: 1,
      curve: 'cardinal',
      markers: false,
      lineSize: 3
    }),
    new LineChartData({
      id: 'expenses',
      data: this.data.generateRandomDateValues(10, 400, 950),
      area: true,
      areaOpacity: 1,
      curve: 'cardinal',
      markers: false,
      color: '#34B77C',
      areaColor: '#34B77C',
      markerColor: '#34B77C',
      lineSize: 3
    })
  ];

  constructor(public data: DataService, public themeService: ThemeService) { }

  ngOnInit(): void {
    this.sub.add(
      this.themeService.theme
        .subscribe(theme => {
          this.lineChartOptions = theme === 'bright' ? this.lineChartOptionsBright : this.lineChartOptionsDark;
          this.lineChartData = theme === 'bright' ? this.lineChartDataBright : this.lineChartDataDark;
        })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
