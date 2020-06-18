# Angular SVG Charts

This is a set of fully customizable Angular components for visualizing data.

Currently it includes Line/Area Chart, Realtime Line/Area Chart and Pie Chart.

Check live [demo](https://ngx-graph.jankuri.com).

## Running Demo Locally

You can run demo app locally, just follow this steps.

```sh
git clone https://github.com/jkuri/ngx-graph
cd ngx-graph
npm install // or yarn install
npm start
```

## Installation

Install the npm package.

```sh
npm i ngx-graph
```

Import module that you need.

```ts
import { LineChartModule, RealtimeChartModule, PieChartModule } from 'ngx-graph';

@NgModule({
  imports: [LineChartModule, RealtimeChartModule, PieChartModule]
})
```

## Line / Area Chart

### Preview

Sample of Line / Area Chart:

![Screenshot 2020-06-18 at 19 33 45](https://user-images.githubusercontent.com/1796022/85053421-c1a33500-b19a-11ea-83ab-904f9aa45b3a.png)

### Usage

This is sample usage of preview above with full source accessible [here](https://github.com/jkuri/ngx-graph/tree/master/projects/app/src/app/components/demo-line-area-chart).

In template:

```html
<ngx-line-chart [props]="props" [data]="data"></ngx-line-chart>
```

In your component:

```ts
import {
  LineChartProperties,
  LineChartScaleProperties,
  GridProperties,
  LineChartData,
  InteractionProperties
} from 'ngx-graph';

props: LineChartProperties = new LineChartProperties({
  height: 300,
  margin: { top: 20, right: 40, bottom: 80, left: 60 },
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
  legendPosition: 'bottom',
  legendMargin: { top: 0, right: 0, left: 0, bottom: 0 },
  initialTransition: false,
  interaction: new InteractionProperties({
    axisLine: true,
    axisLineSize: 4,
    axisLineColor: '#eef0f7',
    tooltip: true,
  })
});

data: LineChartData[] = [
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
```

For a full list of options please check [here](https://github.com/jkuri/ngx-graph/blob/master/projects/ngx-graph/src/lib/line-chart/line-chart.class.ts#L233-L246).

## Real-Time Chart

### Preview

![ngx-graph-realtime](https://user-images.githubusercontent.com/1796022/85064398-ccb29100-b1ab-11ea-9729-c90cd2de98e6.gif)

### Usage

For above sample you can check source code [here](https://github.com/jkuri/ngx-graph/tree/master/projects/app/src/app/components/demo-realtime-chart).

In your template:

```html
<ngx-realtime-chart [options]="realtimeChartOptions" [data]="realtimeChartData"></ngx-realtime-chart>
```

In your component:

```ts
import { interval } from 'rxjs';
import { timeInterval } from 'rxjs/operators';
import { RealtimeChartSettings } from 'ngx-graph';

realtimeChartOptions: RealtimeChartSettings = {
  height: 300,
  margin: { left: 40 },
  lines: [
    { color: '#34B77C', lineWidth: 3, area: true, areaColor: '#34B77C', areaOpacity: .2 }
  ],
  xGrid: { tickPadding: 15, tickNumber: 5 },
  yGrid: { min: 0, max: 100, tickNumber: 5, tickFormat: (v: number) => `${v}%`, tickPadding: 25 }
};

ngOnInit(): void {
  // push new value to real-time chart every second (example)
  interval(1000)
    .pipe(timeInterval())
    .subscribe(() => {
      this.realtimeChartData[0].push({ date: new Date(), value: this.data.randomInt(0, 100) });
    })
}
```

For full list of options please check [here](https://github.com/jkuri/ngx-graph/blob/master/projects/ngx-graph/src/lib/realtime-chart/realtime-chart.interface.ts#L47-L56).

## License

MIT
