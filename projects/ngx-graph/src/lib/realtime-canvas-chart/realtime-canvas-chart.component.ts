import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ResizeService } from '../shared/resize.service';
import {
  defaultRealtimeCanvasChartOptions,
  RealtimeCanvasChartData,
  RealtimeCanvasChartOptions
} from './realtime-canvas-chart.interface';
import { scaleLinear, ScaleLinear, scaleTime, ScaleTime } from 'd3-scale';
import { select, Selection } from 'd3-selection';
import { area, Area, line, Line, curveBasis } from 'd3-shape';
import { min, max } from 'd3-array';
import { Axis, axisBottom, axisLeft } from 'd3-axis';
import { subSeconds } from 'date-fns';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { hexToRgb } from '../line-chart/line-chart.class';
import { curveTypeMapping } from '../shared/chart.interface';

@Component({
  selector: 'ngx-realtime-canvas-chart',
  templateUrl: './realtime-canvas-chart.component.html',
  styleUrls: ['./realtime-canvas-chart.component.sass']
})
export class RealtimeCanvasChartComponent implements OnInit, OnDestroy {
  @Input() data: RealtimeCanvasChartData[][] = [];
  @Input() options: RealtimeCanvasChartOptions;

  id = Math.random().toString(36).slice(-5);
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
  g: Selection<SVGGElement, unknown, null, undefined>;
  xAxis: Selection<SVGGElement, unknown, null, undefined>;
  yAxis: Selection<SVGGElement, unknown, null, undefined>;
  interval: any;
  subs: Subscription = new Subscription();

  constructor(private elementRef: ElementRef, private resizeService: ResizeService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.initChart();
    this.subs.add(this.resizeService.onResize$.pipe(debounceTime(500)).subscribe(() => this.redrawChart()));
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.subs.unsubscribe();
  }

  private initChart(): void {
    this.el = this.elementRef.nativeElement.querySelector('.realtime-canvas-chart-container');
    this.svg = select(this.el).append('svg');
    this.g = this.svg.append('g');
    this.canvas = this.el.querySelector('canvas');
    this.context = this.canvas.getContext('2d');

    this.initOptions();
    this.setDimensions();

    const canvas = select(this.canvas);
    canvas.attr('width', this.width).attr('height', this.height);

    this.x = scaleTime().range([0, this.width]);
    this.y = scaleLinear().range([this.height, 0]);

    this.line = line()
      .x((d: any) => this.x(d.date))
      .y((d: any) => this.y(d.value))
      .context(this.context);

    this.area = area()
      .x((d: any) => this.x(d.date))
      .y1((d: any) => this.y(d.value))
      .y0(this.height)
      .context(this.context);

    this.interval = setInterval(() => this.drawChart(), 1000 / this.options.fps);
  }

  private redrawChart(): void {
    clearInterval(this.interval);
    this.svg.remove();
    this.initChart();
  }

  private drawChart(): void {
    this.g.selectAll('*').remove();

    this.drawAxes();
    this.updateData();

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.data.forEach((d, i) => {
      this.context.beginPath();
      this.line.curve(curveTypeMapping[this.options.lines[i].curve]);
      this.line(d as any);
      this.context.lineWidth = this.options.lines[i].lineWidth;
      this.context.strokeStyle = `rgba(${hexToRgb(this.options.lines[i].color)}, ${this.options.lines[i].opacity})`;
      this.context.lineCap = 'round';
      this.context.lineJoin = 'round';
      this.context.stroke();
      this.context.closePath();
    });

    this.data.forEach((d, i) => {
      if (this.options.lines[i].area) {
        this.context.beginPath();
        this.area.curve(curveTypeMapping[this.options.lines[i].curve]);
        this.area(d as any);
        this.context.fillStyle = `rgba(${hexToRgb(this.options.lines[i].areaColor)}, ${
          this.options.lines[i].areaOpacity
        })`;
        this.context.fill();
        this.context.closePath();
      }
    });
  }

  private updateData(): void {
    const validTime = subSeconds(new Date(), this.options.timeSlots);
    this.data = this.data.map(data => {
      let count = 0;
      while (data.length - count >= this.options.timeSlots && data[count + 1].date < validTime) {
        count++;
      }
      if (count > 0) {
        data.splice(0, count);
      }

      const now = new Date();
      const last = (data && data.length && data[data.length - 1]) || { date: now, value: 0 };
      if (last.date === now || now.getTime() - last.date.getTime() > 1000) {
        data.push({ date: now, value: last.value });
        if (data.length - 1 > this.options.timeSlots) {
          data.splice(0, data.length - this.options.timeSlots);
        }
      }

      return data;
    });
  }

  private setDomains(): void {
    this.x = scaleTime().range([0, this.width]);
    this.y = scaleLinear().range([this.height, 0]);

    this.x.domain([subSeconds(new Date(), this.options.timeSlots - 2), subSeconds(new Date(), 2)]);

    const values = this.data.reduce((acc, curr) => acc.concat(curr.map((d: any) => d.value)), []);
    const [minv, maxv] = [Number(min(values as any)), Number(max(values as any))];
    const factor = (maxv - minv) * 0.05;
    const [ymin, ymax] = [
      this.options.yGrid.min === 'auto' ? Number(minv) - factor : this.options.yGrid.min,
      this.options.yGrid.max === 'auto' ? Number(maxv) + factor : this.options.yGrid.max
    ];
    this.y.domain([ymin, ymax]);
  }

  private drawAxes(): void {
    this.setDomains();

    const { y, x } = this.getAxesData();

    if (this.options.xGrid.enable) {
      this.xAxis = this.g.append('g').attr('class', 'x axis').call(x).attr('transform', `translate(0, ${this.height})`);
    }

    if (this.options.yGrid.enable) {
      this.yAxis = this.g.append('g').attr('class', 'y axis').call(y);
    }

    this.styleAxes();
  }

  private getAxesData(): {
    y: Axis<number | { valueOf(): number }>;
    x: Axis<number | Date | { valueOf(): number }>;
  } {
    return {
      y: axisLeft(this.y)
        .tickSize(-this.width)
        .tickPadding(this.options.yGrid.tickPadding)
        .ticks(
          this.options.yGrid.tickNumber,
          typeof this.options.yGrid.tickFormat !== 'function' ? this.options.yGrid.tickFormat : null
        )
        .tickFormat(
          typeof this.options.yGrid.tickFormat === 'function' ? (this.options.yGrid.tickFormat as any) : null
        ),
      x: axisBottom(this.x)
        .tickSizeInner(-this.height)
        .tickSizeOuter(0)
        .tickPadding(this.options.xGrid.tickPadding)
        .ticks(this.options.xGrid.tickNumber, this.options.xGrid.tickFormat)
    };
  }

  private styleAxes(): void {
    if (this.options.xGrid.enable) {
      this.xAxis
        .selectAll('g.tick')
        .select('line')
        .style('shape-rendering', 'crispEdges')
        .style('fill', 'none')
        .style('stroke', this.options.xGrid.color)
        .style('stroke-width', this.options.xGrid.size)
        .style('stroke-dasharray', this.options.xGrid.dashed ? '3 3' : '0')
        .style('opacity', this.options.xGrid.opacity);

      this.xAxis
        .selectAll('g.tick')
        .selectAll('text')
        .attr('text-anchor', this.options.xGrid.tickFontAnchor)
        .style('fill', this.options.xGrid.tickFontColor)
        .style('font-size', this.options.xGrid.tickFontSize)
        .style('font-family', this.options.xGrid.tickFontFamily)
        .style('font-weight', this.options.xGrid.tickFontWeight);
    }

    if (this.options.yGrid.enable) {
      this.yAxis
        .selectAll('g.tick')
        .select('line')
        .style('shape-rendering', 'crispEdges')
        .style('fill', 'none')
        .style('stroke', this.options.yGrid.color)
        .style('stroke-width', this.options.yGrid.size)
        .style('stroke-dasharray', this.options.yGrid.dashed ? '3 3' : '0')
        .style('opacity', this.options.yGrid.opacity);

      this.yAxis
        .selectAll('g.tick')
        .selectAll('text')
        .attr('text-anchor', this.options.yGrid.tickFontAnchor)
        .style('fill', this.options.yGrid.tickFontColor)
        .style('font-size', this.options.yGrid.tickFontSize)
        .style('font-family', this.options.yGrid.tickFontFamily)
        .style('font-weight', this.options.yGrid.tickFontWeight);
    }

    this.svg.selectAll('.axis').select('path').style('display', 'none');
  }

  private setDimensions(): void {
    const w = this.options.width || this.el.clientWidth;
    const h = this.options.height || this.el.clientHeight;
    this.width = w - this.options.margin.left - this.options.margin.right;
    this.height = h - this.options.margin.top - this.options.margin.bottom;

    this.svg
      .attr('width', this.width + this.options.margin.left + this.options.margin.right)
      .attr('height', this.height + this.options.margin.top + this.options.margin.bottom);

    this.g.attr('transform', `translate(${this.options.margin.left}, ${this.options.margin.top})`);

    this.renderer.setStyle(this.canvas, 'width', this.width + 'px');
    this.renderer.setStyle(this.canvas, 'height', this.height + 'px');
    this.renderer.setStyle(this.canvas, 'top', this.options.margin.top + 'px');
    this.renderer.setStyle(this.canvas, 'left', this.options.margin.left + 'px');
  }

  private initOptions(): void {
    this.options = {
      ...defaultRealtimeCanvasChartOptions,
      ...this.options,
      margin: { ...defaultRealtimeCanvasChartOptions.margin, ...(this.options.margin || {}) }
    };
    this.options.xGrid = { ...defaultRealtimeCanvasChartOptions.xGrid, ...(this.options.xGrid || {}) };
    this.options.yGrid = { ...defaultRealtimeCanvasChartOptions.yGrid, ...(this.options.yGrid || {}) };
    this.options.lines = this.options.lines || [];
    (this.data || []).forEach((d: any, i: number) => {
      this.options.lines[i] = {
        ...{
          color: this.options.colors[i],
          opacity: 1,
          lineWidth: 2,
          area: true,
          areaColor: this.options.colors[i],
          areaOpacity: 0.1,
          curve: 'basis'
        },
        ...this.options.lines[i]
      };
    });
  }
}
