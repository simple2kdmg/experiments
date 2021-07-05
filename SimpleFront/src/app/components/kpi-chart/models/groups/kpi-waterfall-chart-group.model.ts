import * as d3 from 'd3';
import { IKpiChartGroup } from './kpi-chart-group.interface';
import { KpiChartGroupInfo } from './kpi-chart-group-info.model';
import { KpiChartDatum } from '../data/kpi-chart-datum.model';
import { KpiChartConfig } from '../data/kpi-chart-config.model';
import { KpiChartScales } from '../axis/kpi-chart-scales.model';
import { appendLabelIcon } from '../optional/kpi-chart-icons.model';


export class KpiWaterfallChartGroup implements IKpiChartGroup {
  active: boolean;
  get size(): number { return this.info.data.length; }
  get data(): KpiChartDatum[] { return this.info.data; }
  private waterfallGroup: d3.Selection<d3.BaseType, KpiChartDatum[], SVGGElement, unknown>;
  private barPositions: Array<{x: number, y: number, height: number}>;

  constructor(public container: d3.Selection<SVGGElement, unknown, null, undefined>,
              public pointReferenceContainer: d3.Selection<SVGGElement, unknown, null, undefined>,
              public info: KpiChartGroupInfo,
              private config: KpiChartConfig) {
    this.active = true;
  }

  public calculateStackedValues(stackedGroup: IKpiChartGroup): void { }

  public draw(scales: KpiChartScales): void {
    if (!this.data?.length) return;
    this.barPositions = [];
    let cumulativeValue = 0;

    this.waterfallGroup = this.container.selectAll(`g.wtfl-group-${this.info.groupId}`)
      .data([this.data])
      .join('g')
        .attr('class', `wtfl-group-${this.info.groupId}`)
        //.attr('transform', `translate(${this.config.barWidth / 2}, 0)`);

    this.waterfallGroup.selectAll('rect')
      .data(this.data)
      .join('rect')
        .attr('class', (d, i) => `bar-${i}`)
        .style('fill', d => d.color || this.info.groupColor)
        .attr('stroke', '#383838')
        .attr('stroke-width', 0.5)
        .attr('width', scales.xBand.bandwidth() / 2)
        .attr('height', d => {
          const height = Math.abs(scales.yPrimary(d.yValue) - scales.yPrimary(0));
          this.barPositions.push({x: null, y: null, height});
          return height;
        })
        .attr('x', (d, i) => {
          const x = scales.getScaledXValue(d) + scales.xBand.bandwidth() / 4;
          this.barPositions[i].x = x;
          return x;
        })
        .attr('y', (d, i) => {
          let y;
          if (d.isSpecial) {
            y = scales.yPrimary(Math.max(0, d.yValue));
            cumulativeValue = d.yValue;
          } else {
            y = scales.yPrimary(d.yValue + cumulativeValue);
            if (d.yValue < 0) y -= this.barPositions[i].height;
            cumulativeValue += d.yValue;
          }
          this.barPositions[i].y = y;
          return y;
        });
  }

  public drawPointReference(): void {
    this.drawLabels();
  }

  public onMouseOver(index?: number): void {
    if (!this.active || !this.data?.length) return;
    if (index != null) {
      this.waterfallGroup.select(`rect.bar-${index}`).style('fill', this.data[index]?.brighterColor);
    } else {
      this.waterfallGroup.selectAll('rect').data(this.data).style('fill', d => d.brighterColor);
    }
  }

  public onMouseOut(): void {
    if (!this.active || !this.data?.length) return;
    this.waterfallGroup.selectAll('rect').data(this.data).style('fill', d => d.color);
  }

  private drawLabels(): void {
    if (!this.info.labelType || !this.data?.length) return;
    const labelGroup = this.pointReferenceContainer.selectAll(`g.bar-labels-${this.info.groupId}`)
      .data([this.data])
      .join('g')
        .attr('class', `bar-labels-${this.info.groupId}`)
        .attr('transform', `translate(${this.info.shift * this.config.barWidth / 4}, 0)` );

    if (this.info.labelType !== 'yoy') {
      labelGroup.selectAll('text')
        .data(this.active ? this.data : [])
        .join('text')
          .attr('x', (d, i) => this.barPositions[i].x)
          .attr('y', (d, i) => d.yValue >= 0 ? this.barPositions[i].y - 6 : this.barPositions[i].y + this.barPositions[i].height + 14)
          .attr('text-anchor', 'middle')
          .attr('fill', d => d.labelColor || d.color)
          .text(d => KpiChartDatum.formatLabel(d, this.info.labelType, this.info.labelValueFormat));
    } else {
      const ctx = this;
      const labelGroups = labelGroup.selectAll('g').data(this.active ? this.data : []);
  
      labelGroups.enter()
        .append('g')
          .attr('transform', (d, i, e) => {
            const currentGroup = d3.select(e[i]);
            appendLabelIcon(currentGroup, d.labelIcon, d.labelColor || d.color);
            ctx.appendText(currentGroup, d);
            const groupLength = currentGroup.node().getBBox().width;
            const x = ctx.barPositions[i].x;
            const y = d.yValue >= 0 ? ctx.barPositions[i].y - 6 : ctx.barPositions[i].y + ctx.barPositions[i].height + 14;
            return `translate(${x - groupLength / 2}, ${y})`;
          });
  
      labelGroups.attr('transform', (d, i, e) => {
        const currentGroup = d3.select(e[i]) as d3.Selection<SVGGElement, unknown, null, undefined>;
        appendLabelIcon(currentGroup, d.labelIcon, d.labelColor || d.color);
        currentGroup.select('text')
          .text(KpiChartDatum.formatLabel(d, this.info.labelType, this.info.labelValueFormat))
          .attr('fill', d.labelColor || d.color);
        const groupLength = currentGroup.node().getBBox().width;
        const x = ctx.barPositions[i].x;
        const y = d.yValue >= 0 ? ctx.barPositions[i].y - 6 : ctx.barPositions[i].y + ctx.barPositions[i].height + 14;
        return `translate(${x - groupLength / 2}, ${y})`;
      });

      labelGroups.exit().remove();
    }

  }

  private appendText(selection: d3.Selection<SVGGElement, unknown, null, undefined>,
                     datum: KpiChartDatum): void {
    selection.append('text')
      .text(KpiChartDatum.formatLabel(datum, this.info.labelType, this.info.labelValueFormat))
      .attr('transform', 'translate(14, 0)')
      .attr('fill', datum.labelColor || datum.color)
      .style('font-size', '14px');
  }
}