# Angular SVG Charts

This is a set of fully customizable Angular components for visualizing data.

Currently it includes Line/Area Chart, Realtime Line/Area Chart and Pie Chart.

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

## License

MIT
