import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoLineAreaChartComponent } from './components/demo-line-area-chart/demo-line-area-chart.component';
import { DemoRealtimeChartComponent } from './components/demo-realtime-chart/demo-realtime-chart.component';
import { DemoPieChartComponent } from './components/demo-pie-chart/demo-pie-chart.component';
import { DemoRealtimeCanvasChartComponent } from './components/demo-realtime-canvas-chart/demo-realtime-canvas-chart.component';
import { DemoBarChartComponent } from './components/demo-bar-chart/demo-bar-chart.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'line' },
  { path: 'line', component: DemoLineAreaChartComponent },
  { path: 'realtime', component: DemoRealtimeChartComponent },
  { path: 'realtime-canvas', component: DemoRealtimeCanvasChartComponent },
  { path: 'pie', component: DemoPieChartComponent },
  { path: 'bar', component: DemoBarChartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
