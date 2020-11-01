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
import { Axis, axisBottom, axisLeft } from 'd3-axis';
import { addMilliseconds, subMilliseconds, subSeconds } from 'date-fns';

@Component({
  selector: 'ngx-realtime-canvas-chart',
  templateUrl: './realtime-canvas-chart.component.html',
  styleUrls: ['./realtime-canvas-chart.component.sass']
})
export class RealtimeCanvasChartComponent implements OnInit, OnChanges {
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
  clipPath: Selection<SVGRectElement, unknown, null, undefined>;
  clipPathURL: string;

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
    this.svg = select(this.el).append('svg');
    this.g = this.svg.append('g');
    this.clipPath = this.svg
      .append('defs')
      .append('clipPath')
      .attr('id', `${this.id}-clip`)
      .append('rect')
      .attr('transform', `translate(0, 0)`);
    this.clipPathURL = `url(${location.href}#${this.id}-clip)`;
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
    this.g.selectAll('*').remove();

    this.drawAxes();
    this.dropOldData();

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

  private setDomains(): void {
    this.x = scaleTime().range([0, this.width]);
    this.y = scaleLinear().range([this.height, 0]);

    this.x.domain([subSeconds(new Date(), 59), subSeconds(new Date(), 2)]);
    this.y.domain([0, 100]);
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

    this.clipPath.attr('width', this.width).attr('height', this.height);

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
  }

  private getData(): RealtimeCanvasChartData[] {
    return this.data.reduce((acc, curr) => acc.concat(curr), []);
  }
}
