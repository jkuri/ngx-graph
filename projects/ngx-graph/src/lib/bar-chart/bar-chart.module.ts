import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BarChartComponent } from './bar-chart.component';
import { ResizeService } from '../shared/resize.service';

@NgModule({
  imports: [CommonModule],
  declarations: [BarChartComponent],
  exports: [BarChartComponent],
  providers: [ResizeService]
})
export class BarChartModule {}
