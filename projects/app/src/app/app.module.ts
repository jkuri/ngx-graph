import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LineChartModule, RealtimeChartModule, PieChartModule, RealtimeCanvasChartModule } from 'ngx-graph';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoLineAreaChartComponent } from './components/demo-line-area-chart/demo-line-area-chart.component';
import { DemoRealtimeChartComponent } from './components/demo-realtime-chart/demo-realtime-chart.component';
import { DemoPieChartComponent } from './components/demo-pie-chart/demo-pie-chart.component';
import { DataService } from './providers/data.service';
import { HeaderComponent } from './components/header/header.component';
import { ThemeService } from './providers/theme.service';
import { ToggleComponent } from './components/toggle/toggle.component';
import { LineChartFormModalComponent } from './components/line-chart-form-modal/line-chart-form-modal.component';
import { ThemePickerComponent } from './components/theme-picker/theme-picker.component';
import { DemoRealtimeCanvasChartComponent } from './components/demo-realtime-canvas-chart/demo-realtime-canvas-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoLineAreaChartComponent,
    DemoRealtimeChartComponent,
    DemoPieChartComponent,
    HeaderComponent,
    ToggleComponent,
    LineChartFormModalComponent,
    ThemePickerComponent,
    DemoRealtimeCanvasChartComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    LineChartModule,
    RealtimeChartModule,
    PieChartModule,
    RealtimeCanvasChartModule
  ],
  providers: [DataService, ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule {}
