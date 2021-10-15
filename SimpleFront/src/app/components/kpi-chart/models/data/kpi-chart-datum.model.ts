import * as d3 from 'd3';
import { KpiChartXAxisType } from '../axis/kpi-chart-axis-type.model';
import { KpiChartConfig } from './kpi-chart-config.model';
import { KpiChartValueFormat } from './kpi-chart-value-format.model';
import { KpiChartLabelType } from './kpi-chart-label-type.model';
import { KpiChartLabelIconType } from './kpi-chart-label-icon-type.model';

export class KpiChartRequestedDatum {
  groupId: number;
  xNumberValue: number;
  xDateValue: Date;
  xBandValue: string;
  yValue: number;
  zValue: number;
  color: string;
  textLabel: string; // TODO
  numericLabel: number; // TODO
  labelColor: string;
  labelIcon: KpiChartLabelIconType;
  isSpecial?: boolean;

  constructor(init: Partial<KpiChartRequestedDatum>) {
    Object.assign(this, init);
  }
}

export class KpiChartDatum extends KpiChartRequestedDatum {
  y0Value: number;
  brighterColor: string;
  pointOrder: number;

  constructor(init: Partial<KpiChartRequestedDatum>, xAxisType: KpiChartXAxisType, pointOrder: number) {
    super(init);
    this.y0Value = null;
    this.color = this.color || '#9bd2cb';
    this.brighterColor = this.brighterColor || d3.rgb(this.color).brighter(0.2).formatRgb();
    this.pointOrder = pointOrder;
  }

  public static formatXValue(value: number, config: KpiChartConfig): string {
    if (config.xAxisType === 'percent') return d3.format('.0%')(value);
    return d3.format(',')(Math.round(value));
  }

  public static formatYValue(value: number, config: KpiChartConfig, useSecondaryAxis = false): string {
    const yAxisType = useSecondaryAxis ? config.ySecondaryAxisType : config.yPrimaryAxisType;
    if (yAxisType === 'percent') return d3.format('.0%')(value);
    value = KpiChartDatum.applyExponent(value, config.yFormat);
    return d3.format(',')(Math.round(value * 10) / 10);
  }

  /**
   * Format Y value and takes in account `tooltipNoFormat` param from the config to be
   * able to ignore formatting value in tooltip.
   */
  public static formatTooltipYValue(value: number, config: KpiChartConfig, useSecondaryAxis = false): string {
    const yAxisType = useSecondaryAxis ? config.ySecondaryAxisType : config.yPrimaryAxisType;
    if (yAxisType === 'percent') return d3.format('.0%')(value);
    if (!config.tooltipNoFormat) value = KpiChartDatum.applyExponent(value, config.yFormat);
    return d3.format(',')(Math.round(value * 10) / 10);
  }

  public static groupByYear(data: KpiChartDatum[]): { year: number, data: KpiChartDatum[] }[] {
    const map = new Map<number, KpiChartDatum[]>();

    data.forEach(datum => {
      const year = (datum.xDateValue).getFullYear();
      if (map.has(year)) {
        map.get(year).push(datum);
      } else {
        map.set(year, [datum]);
      }
    });

    return [...map.keys()].sort((y1, y2) => y1 - y2).map(year => ({ year, data: map.get(year) }));
  }

  public static formatLabel(datum: KpiChartDatum, labelType: KpiChartLabelType, labelFormat: string): string {
    switch (labelType) {
      case 'text':
        return datum.textLabel;
      case 'percent':
        return d3.format(labelFormat || '.0%')(datum.numericLabel);
      case 'yoy':
        return d3.format(labelFormat || '.0%')(Math.abs(datum.numericLabel));
      case 'number':
        return labelFormat ? d3.format(labelFormat)(datum.numericLabel) : Math.round(datum.numericLabel).toString();
    }
  }

  private static applyExponent(value: number, yFormat: KpiChartValueFormat): number {
    switch(yFormat) {
      case 'K':
        return (value as number) / 1000;
      case 'M':
        return (value as number) / 1000000;
      default:
        return value;
    }
  }
}