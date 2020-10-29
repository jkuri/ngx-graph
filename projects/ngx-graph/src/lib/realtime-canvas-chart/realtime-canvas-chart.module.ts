import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResizeService } from '../shared/resize.service';
import { RealtimeCanvasChartComponent } from './realtime-canvas-chart.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RealtimeCanvasChartComponent],
  exports: [RealtimeCanvasChartComponent],
  providers: [ResizeService]
})
export class RealtimeCanvasChartModule {}
