import { CurveType } from '../shared/chart.interface';
import { Colors } from '../shared/color';

export interface RealtimeCanvasChartData {
  date: Date;
  value: number;
}

export interface RealtimeCanvasChartLineOptions {
  color?: string;
  opacity?: number;
  lineWidth?: number;
  area?: boolean;
  areaColor?: string;
  areaOpacity?: number;
  curve?: CurveType;
}

interface RealtimeCanvasChartGridOptions {
  enable?: boolean;
  color?: string;
  size?: number;
  dashed?: boolean;
  opacity?: number;
  ticks?: boolean;
  tickNumber?: number;
  tickPadding?: number;
  tickFontSize?: number;
  tickFontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
  tickFontColor?: string;
  tickFontFamily?: string;
  tickFontAnchor?: 'start' | 'middle' | 'end';
}

export interface RealtimeCanvasChartXGridOptions extends RealtimeCanvasChartGridOptions {
  tickFormat?: string;
}

export interface RealtimeCanvasChartYGridOptions extends RealtimeCanvasChartGridOptions {
  min?: number | 'auto';
  max?: number | 'auto';
  tickValues?: string[];
  tickFormat?: string | ((v: string | number) => string);
}

export interface RealtimeCanvasChartOptions {
  width?: number;
  height?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  fps?: number;
  timeSlots?: number;
  lines?: RealtimeCanvasChartLineOptions[];
  xGrid?: RealtimeCanvasChartXGridOptions;
  yGrid?: RealtimeCanvasChartYGridOptions;
  colors?: string[];
}

export const defaultRealtimeCanvasChartOptions: RealtimeCanvasChartOptions = {
  margin: { top: 25, right: 25, bottom: 25, left: 25 },
  fps: 24,
  timeSlots: 60,
  xGrid: {
    enable: true,
    color: '#e9e9e9',
    size: 2,
    dashed: true,
    opacity: 0.5,
    ticks: true,
    tickFormat: '%H:%M:%S',
    tickPadding: 10,
    tickFontColor: '#6B6C6F',
    tickFontWeight: 'normal',
    tickFontSize: 10,
    tickFontFamily: 'sans-serif',
    tickFontAnchor: 'middle'
  },
  yGrid: {
    enable: true,
    color: '#e9e9e9',
    size: 2,
    dashed: true,
    opacity: 0.5,
    min: 'auto',
    max: 'auto',
    ticks: true,
    tickFormat: '~s',
    tickPadding: 10,
    tickFontColor: '#6B6C6F',
    tickFontWeight: 'normal',
    tickFontSize: 10,
    tickFontFamily: 'sans-serif',
    tickFontAnchor: 'middle'
  },
  colors: Colors
};
