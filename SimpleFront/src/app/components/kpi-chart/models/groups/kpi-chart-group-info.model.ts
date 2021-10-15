import * as d3 from 'd3';
import { KpiChartType } from "../data/kpi-chart-type.model";
import { KpiChartLabelType } from "../data/kpi-chart-label-type.model";
import { KpiChartRequestedDatum, KpiChartDatum } from '../data/kpi-chart-datum.model';
import { KpiChartConfig } from '../data/kpi-chart-config.model';

export class KpiChartGroupInfoBase {
  groupId: number;
  groupName: string;
  groupType: KpiChartType; // DB string
  groupOrder: number;
  groupColor: string;
  useSecondaryYAxis: boolean;
  stackedGroupId: number;
  shift: number;
  labelType: KpiChartLabelType;
  labelValueFormat: string;
  currency?: string;
}

export class KpiChartRequestedGroupInfo extends KpiChartGroupInfoBase {
  data: KpiChartRequestedDatum[];

  constructor(init?: KpiChartRequestedGroupInfo) {
    super();
    Object.assign(this, init);
  }
}

export class KpiChartGroupInfo extends KpiChartGroupInfoBase {
  brighterGroupColor: string;
  data: KpiChartDatum[];
  notNullData: KpiChartDatum[]; // some charts should skip points with yValue == null.
  minYValue: number;
  maxYValue: number;

  constructor(requestedInfo: KpiChartRequestedGroupInfo, private config: KpiChartConfig) {
    super();
    const { data, ...baseProps } = requestedInfo;
    Object.assign(this, baseProps);
    this.notNullData = [];
    this.data = this.formatRequestedData(data);
    this.adjustMinAndMaxValues();
    this.brighterGroupColor = this.brighterGroupColor || d3.rgb(this.groupColor).brighter(0.4).formatRgb();
  }

  private formatRequestedData(requestedData: KpiChartRequestedDatum[]): KpiChartDatum[] {
    let pointOrder = 0;
    this.minYValue = requestedData[0]?.yValue;
    this.maxYValue = requestedData[0]?.yValue;
    const sortedData = this.sortData(requestedData);
    return sortedData.map(reqDatum => {
        this.minYValue = reqDatum.yValue < this.minYValue ? reqDatum.yValue : this.minYValue;
        this.maxYValue = reqDatum.yValue > this.maxYValue ? reqDatum.yValue : this.maxYValue;
        const datum = new KpiChartDatum(reqDatum, this.config.xAxisType, pointOrder++);
        if (datum.yValue != null) this.notNullData.push(datum);
        return datum;
      });
  }

  private adjustMinAndMaxValues(): void {
    if (this.groupType !== 'waterfall') return;
    let cumulativeValue = 0;
    [this.minYValue, this.maxYValue] = this.data.reduce(([min, max], curr, i) => {
      const combinedValue = curr.isSpecial ? curr.yValue : curr.yValue + cumulativeValue;
      if (combinedValue < min) min = combinedValue;
      if (combinedValue > max) max = combinedValue;
      if (!curr.isSpecial || i === 0) cumulativeValue += curr.yValue;
      return [min, max];
    }, [0, 0]);
  }

  private sortData(data: KpiChartRequestedDatum[]): KpiChartRequestedDatum[] {
    switch(this.config.xAxisType) {
      case 'date':
        return data.sort((d1, d2) => +d1.xDateValue - +d2.xDateValue);
      case 'band':
        return data;
      default:
        return data.sort((d1, d2) => d1.xNumberValue - d2.xNumberValue);
    }
  }
}