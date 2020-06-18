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

Light version sample of Line / Area Chart:
![Screenshot 2020-06-18 at 19 33 45](https://user-images.githubusercontent.com/1796022/85053421-c1a33500-b19a-11ea-83ab-904f9aa45b3a.png)

Dark version sample of Line / Area Chart:
![Screenshot 2020-06-18 at 19 33 53](https://user-images.githubusercontent.com/1796022/85053419-c0720800-b19a-11ea-853e-8ff0b3f3872e.png)
