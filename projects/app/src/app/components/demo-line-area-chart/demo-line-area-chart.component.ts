import { Component, OnInit, OnDestroy } from '@angular/core';
import { LineChartProperties, LineChartScaleProperties, GridProperties, LineChartData } from 'ngx-graph';
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

  lineChartProps: LineChartProperties;
  lineChartPropsBright: LineChartProperties = new LineChartProperties({
    height: 300,
    margin: { top: 20, right: 170, bottom: 35, left: 60 },
    yScale: new LineChartScaleProperties({ min: 0, max: 3000 }),
    xGrid: new GridProperties({
      opacity: .4,
      textColor: '#333'
    }),
    yGrid: new GridProperties({
      tickPadding: 13,
      tickFormat: (num: number) => format('~s')(num) + ' €',
      tickTextAnchor: 'end',
      tickNumber: 5,
      opacity: .4,
      textColor: '#333'
    }),
    transitions: true,
    transitionDuration: 400,
    legend: true,
    legendPosition: 'right',
    legendMargin: { top: 0, right: 0, left: 0, bottom: 0 },
    initialTransition: false,
  });
  lineChartPropsDark: LineChartProperties = new LineChartProperties({
    height: 300,
    margin: { top: 20, right: 170, bottom: 35, left: 60 },
    yScale: new LineChartScaleProperties({ min: 0, max: 3000 }),
    xGrid: new GridProperties({
      color: '#BEC6E0',
      opacity: .05,
      textColor: '#BEC6E0'
    }),
    yGrid: new GridProperties({
      tickPadding: 13,
      tickFormat: (num: number) => format('~s')(num) + ' €',
      tickTextAnchor: 'end',
      tickNumber: 5,
      color: '#BEC6E0',
      opacity: .05,
      textColor: '#BEC6E0'
    }),
    transitions: true,
    transitionDuration: 400,
    legend: true,
    legendPosition: 'right',
    legendMargin: { top: 0, right: 0, left: 0, bottom: 0 },
    initialTransition: false,
  });

  lineChartData = [
    new LineChartData({
      id: 'progress',
      data: this.data.generateRandomDateValues(10, 2000, 2900),
      area: true,
      areaOpacity: .4,
      curve: 'cardinal',
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
      curve: 'cardinal',
      markers: true,
      lineSize: 3
    }),
    new LineChartData({
      id: 'expenses',
      data: this.data.generateRandomDateValues(10, 400, 950),
      area: true,
      areaOpacity: .4,
      curve: 'cardinal',
      markers: true,
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
          this.lineChartProps = theme === 'bright' ? this.lineChartPropsBright : this.lineChartPropsDark;
        })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
