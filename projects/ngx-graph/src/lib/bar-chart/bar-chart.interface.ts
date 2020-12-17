const DEFAULT_GRID_COLOR = '#EDEDEE';
const DEFAULT_GRID_TEXT_COLOR = '#CBCBCB';

export type BarDataType = string | number | Date;
export type BarChartData = { category: string; values: { id: string; value: number }[] }[];

export interface BarChartGridOptions {
  type?: 'linear' | 'time' | 'band';
  min?: number | 'auto' | Date;
  max?: number | 'auto' | Date;
  enable?: boolean;
  color?: string;
  size?: number;
  dashed?: boolean;
  opacity?: number;
  text?: boolean;
  tickValues?: string[] | number[] | Date[];
  tickNumber?: number;
  tickPadding?: number;
  tickFormat?: string | ((v: number | Date) => string);
  tickFontSize?: number;
  tickFontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
  tickFontColor?: string;
  tickFontFamily?: string;
  tickFontAnchor?: 'start' | 'middle' | 'end';
}

export interface BarChartOptions {
  width?: number;
  height?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  xGrid?: BarChartGridOptions;
  yGrid?: BarChartGridOptions;
  colors?: string[];
  borderRadius?: number;
  padding?: number;
  tooltip?: boolean;
  transitions?: boolean;
}

export function mergeOptions(o: BarChartOptions): BarChartOptions {
  const defaultOpts = defaultOptions();
  const opts = { ...defaultOpts, ...o };
  opts.margin = { ...defaultOpts.margin, ...(o.margin || {}) };
  opts.xGrid = { ...defaultOpts.xGrid, ...(o.xGrid || {}) };
  opts.yGrid = { ...defaultOpts.yGrid, ...(o.yGrid || {}) };
  opts.colors = o.colors && o.colors.length ? o.colors : defaultOpts.colors;

  return opts;
}

export function defaultOptions(): BarChartOptions {
  return {
    margin: { top: 20, right: 20, bottom: 20, left: 50 },
    xGrid: {
      type: 'band',
      min: 'auto',
      max: 'auto',
      enable: true,
      color: DEFAULT_GRID_COLOR,
      size: 1,
      dashed: false,
      opacity: 1,
      text: true,
      tickPadding: 20,
      tickFormat: '~s',
      tickFontColor: DEFAULT_GRID_TEXT_COLOR,
      tickFontFamily: 'sans-serif',
      tickFontWeight: 'normal',
      tickFontSize: 10,
      tickFontAnchor: 'middle'
    },
    yGrid: {
      type: 'linear',
      min: 'auto',
      max: 'auto',
      enable: true,
      color: DEFAULT_GRID_COLOR,
      size: 1,
      dashed: false,
      opacity: 1,
      text: true,
      tickPadding: 20,
      tickFormat: '~s',
      tickFontColor: DEFAULT_GRID_TEXT_COLOR,
      tickFontFamily: 'sans-serif',
      tickFontWeight: 'normal',
      tickFontSize: 10,
      tickFontAnchor: 'middle'
    },
    colors: [
      '#48bb78',
      '#ecc94b',
      '#ed8936',
      '#f56565',
      '#a0aec0',
      '#ed64a6',
      '#9f7aea',
      '#667eea',
      '#4299e1',
      '#38b2ac'
    ],
    borderRadius: 4,
    padding: 0.1,
    tooltip: true,
    transitions: true
  };
}
