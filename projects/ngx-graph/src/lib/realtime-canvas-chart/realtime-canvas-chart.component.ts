import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';
import { ResizeService } from '../shared/resize.service';
import {
  defaultRealtimeCanvasChartOptions,
  RealtimeCanvasChartData,
  RealtimeCanvasChartOptions
} from './realtime-canvas-chart.interface';
import { scaleLinear, ScaleLinear, scaleTime, ScaleTime } from 'd3-scale';
import { select, Selection } from 'd3-selection';
import { area, Area, line, Line, curveStep, curveBasis } from 'd3-shape';
import { extent, min } from 'd3-array';
import { addMilliseconds, subMilliseconds, subSeconds } from 'date-fns';

@Component({
  selector: 'ngx-realtime-canvas-chart',
  templateUrl: './realtime-canvas-chart.component.html',
  styleUrls: ['./realtime-canvas-chart.component.sass']
})
export class RealtimeCanvasChartComponent implements OnInit, OnChanges {
  @Input() data: RealtimeCanvasChartData[][] = [];
  @Input() options: RealtimeCanvasChartOptions;

  el: HTMLElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  x: ScaleTime<number, number>;
  y: ScaleLinear<number, number>;
  line: Line<[number, number]>;
  area: Area<[number, number]>;
  svg: Selection<SVGSVGElement, unknown, null, undefined>;

  constructor(private elementRef: ElementRef, private resizeService: ResizeService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.initChart();
  }

  ngOnChanges(): void {
    if (!this.el) {
      return;
    }

    // this.drawChart();
  }

  private initChart(): void {
    this.el = this.elementRef.nativeElement.querySelector('.realtime-canvas-chart-container');

    this.initOptions();
    this.setDimensions();

    // this.svg = select(this.el).append('svg');
    this.canvas = this.el.querySelector('canvas');
    this.context = this.canvas.getContext('2d');

    const canvas = select(this.canvas);
    canvas.attr('width', this.width).attr('height', this.height);

    this.x = scaleTime().range([0, this.width]);
    this.y = scaleLinear().range([this.height, 0]);

    this.line = line()
      .x((d: any) => this.x(d.date))
      .y((d: any) => this.y(d.value))
      .curve(curveBasis)
      .context(this.context);

    this.area = area()
      .x((d: any) => this.x(d.date))
      .y1((d: any) => this.y(d.value))
      .y0(this.height)
      .curve(curveBasis)
      .context(this.context);

    this.drawChart();
    this.updateChart();
  }

  private updateChart(): void {
    const animate = () => {
      this.drawChart();
    };

    const interval = setInterval(animate, 1000 / this.options.fps);
  }

  private drawChart(): void {
    this.dropOldData();

    this.x.domain([subSeconds(new Date(), 59), subSeconds(new Date(), 2)]);
    this.y.domain([0, 100]);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.beginPath();

    this.data.forEach(d => this.line(d as any));

    this.context.lineWidth = 1.5;
    this.context.strokeStyle = '#34B77C';
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.stroke();
    this.context.closePath();

    this.context.beginPath();

    this.data.forEach(d => this.area(d as any));

    this.context.fillStyle = 'rgba(52, 183, 124, 0.2)';
    this.context.fill();
  }

  private dropOldData(): void {
    const validTime = subSeconds(new Date(), 60);
    this.data = this.data.map(data => {
      let count = 0;
      while (data.length - count >= 60 && data[count + 1].date < validTime) {
        count++;
      }
      if (count > 0) {
        data.splice(0, count);
      }
      return data;
    });
  }

  private setDimensions(): void {
    const w = this.options.width || this.el.clientWidth;
    const h = this.options.height || this.el.clientHeight;
    this.width = w - this.options.margin.left - this.options.margin.right;
    this.height = h - this.options.margin.top - this.options.margin.bottom;
  }

  private initOptions(): void {
    this.options = { ...defaultRealtimeCanvasChartOptions, ...this.options };
  }

  private getData(): RealtimeCanvasChartData[] {
    return this.data.reduce((acc, curr) => acc.concat(curr), []);
  }
}
