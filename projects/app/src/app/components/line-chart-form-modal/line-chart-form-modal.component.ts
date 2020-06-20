import { Component, OnInit, Input } from '@angular/core';
import { LineChartOptions } from 'ngx-graph';

@Component({
  selector: 'app-line-chart-form-modal',
  templateUrl: './line-chart-form-modal.component.html',
  styleUrls: ['./line-chart-form-modal.component.sass']
})
export class LineChartFormModalComponent implements OnInit {
  @Input() form: LineChartOptions;

  constructor() { }

  ngOnInit(): void { }
}
