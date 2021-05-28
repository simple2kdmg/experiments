import { Component, ViewChild, ElementRef, Input,
         AfterViewInit, OnDestroy, ChangeDetectionStrategy,
         ChangeDetectorRef } from '@angular/core';
import { ReplaySubject, Subscription, combineLatest } from 'rxjs';
import { KpiChartConfig, KpiChartRequestedConfig } from './models/data/kpi-chart-config.model';
import { KpiChartRequestedGroupInfo } from './models/groups/kpi-chart-group-info.model';
import { KpiChart } from './models/kpi-chart.model';
import { KpiChartBand } from './models/optional/kpi-chart-band.model';


@Component({
  selector: 'kpi-chart',
  template: `<div #chart class="chart-container"></div>`,
  styles: ['.chart-container { position: relative; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiChartComponent implements AfterViewInit, OnDestroy {
  @Input() set config(value: KpiChartConfig) {
    if (!value) return;
    if (!Object.keys(value).length) throw new Error('chart config can not be empty');
    this.config$.next(value);
  }
  @Input() set groupInfos(value: KpiChartRequestedGroupInfo[]) {
    if (value) this.groupInfos$.next(value);
  }
  @Input() set chartBand(value: KpiChartBand) {
    if (value) this.band$.next(value);
  }

  @ViewChild('chart', { static: true }) set chart(value: ElementRef) {
    if (value) this.chartContainer = value.nativeElement;
  };

  private chartContainer: HTMLDivElement;
  private kpiChart: KpiChart;
  private config$ = new ReplaySubject<KpiChartRequestedConfig>(1);
  private groupInfos$ = new ReplaySubject<KpiChartRequestedGroupInfo[]>(1);
  private band$ = new ReplaySubject<KpiChartBand>(1);
  private dataSubscription: Subscription;
  private bandSubscription: Subscription;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.kpiChart = new KpiChart(this.chartContainer);
    this.kpiChart.startListenToResizeEvent();

    this.bandSubscription = this.band$.subscribe(band => this.kpiChart.setBand(band));

    this.dataSubscription = combineLatest([
      this.config$,
      this.groupInfos$
    ]).subscribe(([reqConfig, reqGroupInfos]) => {
      this.kpiChart.updateConfig(reqConfig);
      this.kpiChart.updateChartInfo(reqGroupInfos);
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.kpiChart.stopListenToResizeEvent();
    this.bandSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }

}
