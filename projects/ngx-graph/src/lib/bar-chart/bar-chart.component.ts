import { Component, OnInit, Input, OnDestroy, SimpleChanges, OnChanges, ElementRef } from '@angular/core';
import { defaultOptions, mergeOptions, BarChartOptions, BarChartData } from './bar-chart.interface';
import { Selection, select, mouse } from 'd3-selection';
import { ScaleBand, ScaleLinear, scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { Axis, AxisScale, AxisDomain, axisBottom, axisLeft } from 'd3-axis';
import { min, max } from 'd3-array';
import { ResizeService } from '../shared/resize.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.sass']
})
export class BarChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() options: BarChartOptions = defaultOptions();
  @Input() data: BarChartData = [];

  el!: HTMLElement;
  width!: number;
  height!: number;
  x0!: ScaleBand<string>;
  x1!: ScaleBand<string>;
  y!: ScaleBand<string> | ScaleLinear<number, number>;
  svg!: Selection<SVGSVGElement, unknown, null, undefined>;
  g!: Selection<SVGGElement, unknown, null, undefined>;
  xAxis!: Selection<SVGGElement, unknown, null, undefined>;
  yAxis!: Selection<SVGGElement, unknown, null, undefined>;
  tooltip!: Selection<HTMLDivElement, unknown, null, undefined>;
  sub: Subscription = new Subscription();

  constructor(private elementRef: ElementRef, private resizeService: ResizeService) {}

  ngOnInit(): void {
    this.sub = this.resizeService.onResize$.subscribe(() => this.redrawChart());
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.options = mergeOptions(this.options);
    if (!this.el) {
      this.initChart();
    } else {
      this.redrawChart();
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private initChart(): void {
    if (this.el) {
      return;
    }

    this.el = this.elementRef.nativeElement.querySelector('.bar-chart');
    this.svg = select(this.el).append('svg');
    this.g = this.svg.append('g');
    this.tooltip = select(this.el)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('border', '1px solid #E1E8EB')
      .style('border-radius', '4px')
      .style('min-width', '180px')
      .style('text-align', 'center')
      .style('font-size', '13px')
      .style('color', '#4E5859')
      .style('padding', '10px 15px');
    this.drawChart();
  }

  private drawChart(): void {
    this.setDimensions();
    this.setDomains();
    this.drawAxes();

    const color = scaleOrdinal().range(this.options.colors);
    const that = this;

    const e = this.g.append('g');
    const r = e
      .selectAll('g')
      .data(this.data)
      .join('g')
      .attr('transform', (d: any) => `translate(${this.x0(d.category)}, 0)`)
      .selectAll('rect')
      .data(d => d.values.map((v: any) => ({ id: v.id, value: v.value })))
      .join('rect')
      .attr('x', d => this.x1(d.id))
      .attr('y', d => this.y(0 as any))
      .attr('width', this.x1.bandwidth())
      // .attr('height', d => this.y(0 as any) - this.y(d.value))
      .attr('rx', this.options.borderRadius)
      .attr('fill', d => color(d.id) as any);

    if (this.options.transitions) {
      e.selectAll('rect')
        .transition()
        .delay(() => Math.random() * 1000)
        .duration(1000)
        .attr('y', (d: any) => this.y(d.value))
        .attr('height', (d: any) => this.y(0 as any) - this.y(d.value));
    } else {
      e.selectAll('rect')
        .attr('y', (d: any) => this.y(d.value))
        .attr('height', (d: any) => this.y(0 as any) - this.y(d.value));
    }

    if (this.options.tooltip) {
      r
        // tslint:disable-next-line
        .on('mouseover', function (d: any) {
          that.tooltip.style('opacity', 1).html('<p>' + d.id + ': <b>' + d.value + '</b></p>');
        })
        // tslint:disable-next-line
        .on('mousemove', function (d: any) {
          const t = this as any;
          const m = mouse(t.parentNode.parentNode as any);
          that.tooltip.style('left', m[0] + 60 + 'px').style('top', m[1] - 20 + 'px');
        })
        .on('mouseleave', (d: any) => this.tooltip.style('opacity', 0));
    }
  }

  private redrawChart(): void {
    this.g.selectAll('*').remove();
    this.drawChart();
  }

  private setDomains(): void {
    this.x0 = scaleBand()
      .domain(this.data.map(d => d.category))
      .rangeRound([0, this.width]);

    this.x1 = scaleBand()
      .domain(this.data[0].values.map(d => d.id))
      .rangeRound([0, this.x0.bandwidth()])
      .padding(this.options.padding);

    this.y = scaleLinear().range([this.height, 0]);

    const values = this.data.reduce((acc, curr) => acc.concat(curr.values.map(v => v.value)), []);
    const [minv, maxv] = [Number(min(values as any)), Number(max(values as any))];
    const factor = (maxv - minv) * 0.05;
    const [ymin, ymax] = [
      this.options.yGrid.min === 'auto' ? Number(minv) - factor : this.options.yGrid.min,
      this.options.yGrid.max === 'auto' ? Number(maxv) + factor : this.options.yGrid.max
    ];
    this.y.domain([ymin as number | { valueOf(): number }, ymax as number | { valueOf(): number }]);
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

  private getAxesData(): { y: Axis<AxisDomain>; x: Axis<AxisDomain> } {
    return {
      y: axisLeft(this.y as AxisScale<AxisDomain>)
        .tickSize(-this.width)
        .tickPadding(this.options.yGrid.tickPadding)
        .ticks(
          this.options.yGrid.tickNumber,
          typeof this.options.yGrid.tickFormat !== 'function' ? this.options.yGrid.tickFormat : null
        )
        .tickFormat(
          typeof this.options.yGrid.tickFormat === 'function' ? (this.options.yGrid.tickFormat as any) : null
        ),
      x: axisBottom(this.x0 as AxisScale<AxisDomain>)
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
  }
}
