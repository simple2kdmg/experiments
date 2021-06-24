import * as d3 from 'd3';
import { KpiChartScales } from './kpi-chart-scales.model';
import { KpiChartData } from '../data/kpi-chart-data.model';
import { KpiChartConfig } from '../data/kpi-chart-config.model';
import { KpiChartDimensions } from '../data/kpi-chart-dimensions.model';
import { KpiChartDatum } from '../data/kpi-chart-datum.model';


export class KpiChartAxis {
  xAxisSelection: d3.Selection<SVGGElement, unknown, null, undefined>;
  yPrimaryAxisSelection: d3.Selection<SVGGElement, unknown, null, undefined>;
  ySecondaryAxisSelection: d3.Selection<SVGGElement, unknown, null, undefined>;
  scales: KpiChartScales;
  private chartData: KpiChartData;
  private readonly AXIS_COLOR = '#00000014';
  private readonly AXIS_TEXT_COLOR = '#656565';

  constructor(private svgSelection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
              private config: KpiChartConfig,
              private dimensions: KpiChartDimensions) {
    this.initAxisGroups();
    this.scales = new KpiChartScales(config, dimensions);
  }

  public appendData(chartData: KpiChartData): void {
    this.chartData = chartData;
    this.scales.appendData(chartData);
  }

  public draw(): void {
    this.scales.update();
    this.adjustAxisPosition();
    this.drawAxis();
  }

  private initAxisGroups(): void {
    this.xAxisSelection = this.svgSelection.append('g').attr('class', 'x-axis').style('font', '14px MuseoSans300, sans-serif');
    this.yPrimaryAxisSelection = this.svgSelection.append('g').attr('class', 'y-axis-primary');
    if (this.config.ySecondaryAxisType) {
      this.ySecondaryAxisSelection = this.svgSelection.append('g').attr('class', 'y-axis-secondary');
    }
  }

  private adjustAxisPosition(): void {
    const { left, top } = this.dimensions.margin;
    const { width, height } = this.dimensions;
    this.xAxisSelection.attr('transform', `translate(${left}, ${height + top})`);
    this.yPrimaryAxisSelection.attr('transform', `translate(${this.dimensions.margin.left}, ${this.dimensions.margin.top})`);
    if (this.config.ySecondaryAxisType) {
      this.ySecondaryAxisSelection.attr('transform', `translate(${left + width}, ${height + top})`);
    }
  }

  private drawAxis(): void {
    const axisBottom = this.config.xAxisType === 'band' ?
      d3.axisBottom(this.scales.xBand).tickPadding(10) :
      d3.axisBottom(this.scales.xNumber || this.scales.xDate).tickPadding(10);
    axisBottom.tickSize(-this.dimensions.height);

    this.formatXTicks(axisBottom);

    this.xAxisSelection.call(axisBottom)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', this.AXIS_COLOR))
      .call(g => g.selectAll('.tick text').attr('fill', this.AXIS_TEXT_COLOR)).style('font-size', '14px');

    if (this.config.xAxisType === 'date') {
      this.xAxisSelection
        .call(g => g.select('.tick:first-of-type text').remove())
        .call(g => g.select('.tick:last-of-type text').remove());
    }

    if (this.config.groupByYear && this.config.xAxisType === 'date') {
      this.xAxisSelection.selectAll('text.year-group')
        .data( this.getYearGroupLabels() )
        .join('text')
          .attr('class', 'year-group')
          .attr('y', 40)
          .attr('x', data => data.position)
          .attr('fill', this.AXIS_TEXT_COLOR)
          .text(data => data.text);
    }

    const axisLeft = d3.axisLeft(this.scales.yPrimary)
      .tickSize(-this.dimensions.width)
      .tickPadding(10);

    this.formatYTicks(axisLeft);

    this.yPrimaryAxisSelection.call(axisLeft)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', this.AXIS_COLOR))
      .call(g => g.selectAll('.tick text').attr('fill', this.AXIS_TEXT_COLOR)).style('font-size', '14px');

    if (this.config.xTicksOff) {
      this.xAxisSelection.call(axisBottom)
        .call(g => g.selectAll('.tick line').remove())
        .call(g => g.select('path').attr('stroke', this.AXIS_COLOR));
    }

    if (this.config.yTicksOff) {
      this.xAxisSelection.call(axisLeft)
        .call(g => g.selectAll('.tick line').remove())
        .call(g => g.select('path').attr('stroke', this.AXIS_COLOR));
    }
  }

  private getYearGroupLabels(): { text: string, position: number }[] {
    const halfTickStep = this.dimensions.width / (this.chartData.largestActiveGroup.size + 1) / 2;
    const labels = [];
    const groupedByYear = KpiChartDatum.groupByYear(this.chartData.largestActiveGroup.data);

    groupedByYear.forEach(group => {
      if (group.data.length > 1) labels.push({ text: '|', position: this.scales.xDate(group.data[0].xDateValue) - halfTickStep });
      labels.push({
        text: `${group.year}`,
        position: group.data.reduce((sum, datum) => sum + this.scales.xDate(datum.xDateValue) / group.data.length, 0)
      });
    });

    labels.push({ text: '|', position: this.dimensions.width - halfTickStep });

    return labels;
  }

  private formatXTicks(axisBottom: d3.Axis<d3.NumberValue | Date | string>): void {
    if (this.config.xAxisType === 'band') {
      return;
    } else if (this.config.xAxisType === 'date') {
      axisBottom.ticks(this.chartData.largestActiveGroup.size + 2);
      if (this.config.xAxisStep > 1) {
        axisBottom.tickFormat( (v, i) => i % this.config.xAxisStep === 0 ? '' : d3.timeFormat('%b')(v as Date) );
      } else {
        axisBottom.tickFormat(d3.timeFormat('%b'));
      }
    } else {
      if (this.config.xAxisStep > 1) {
        axisBottom.tickFormat( (v, i) => (i + 1) % this.config.xAxisStep === 0 ? '' : KpiChartDatum.formatXValue(v as number, this.config) );
      } else {
        axisBottom.tickFormat(v => KpiChartDatum.formatXValue(v as number, this.config));
      }
    }
  }

  private formatYTicks(axisLeft: d3.Axis<d3.NumberValue>): void {
    if (this.config.yAxisStep > 1) {
      axisLeft.tickFormat((v, i) => (i + 1) % this.config.yAxisStep === 0 ? '' : KpiChartDatum.formatYValue(v as number, this.config));
    } else {
      axisLeft.tickFormat(v => KpiChartDatum.formatYValue(v as number, this.config));
    }
  }

}