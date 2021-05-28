import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiChartComponent } from './kpi-chart.component';


@NgModule({
  declarations: [KpiChartComponent],
  imports: [
    CommonModule
  ],
  exports: [
    KpiChartComponent
  ]
})
export class KpiChartModule { }
