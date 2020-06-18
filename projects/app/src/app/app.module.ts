import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LineChartModule, RealtimeChartModule, PieChartModule } from 'ngx-graph';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoLineAreaChartComponent } from './components/demo-line-area-chart/demo-line-area-chart.component';
import { DemoRealtimeChartComponent } from './components/demo-realtime-chart/demo-realtime-chart.component';
import { DemoPieChartComponent } from './components/demo-pie-chart/demo-pie-chart.component';
import { DataService } from './providers/data.service';
import { HeaderComponent } from './components/header/header.component';
import { ThemeService } from './providers/theme.service';
import { ToggleComponent } from './components/toggle/toggle.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoLineAreaChartComponent,
    DemoRealtimeChartComponent,
    DemoPieChartComponent,
    HeaderComponent,
    ToggleComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    LineChartModule,
    RealtimeChartModule,
    PieChartModule
  ],
  providers: [DataService, ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
