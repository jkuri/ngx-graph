export interface RealtimeCanvasChartData {
  date: Date;
  value: number;
}

export interface RealtimeCanvasChartOptions {
  width?: number;
  height?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  fps?: number;
}

export const defaultRealtimeCanvasChartOptions: RealtimeCanvasChartOptions = {
  margin: { top: 25, right: 25, bottom: 25, left: 25 },
  fps: 24
};
