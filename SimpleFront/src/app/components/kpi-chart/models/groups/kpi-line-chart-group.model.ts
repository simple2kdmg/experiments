import * as d3 from 'd3';
import { KpiChartGroupInfo } from './kpi-chart-group-info.model';
import { IKpiChartGroup } from './kpi-chart-group.interface';
import { KpiChartDatum } from '../data/kpi-chart-datum.model';
import { KpiChartConfig } from '../data/kpi-chart-config.model';
import { KpiChartScales } from '../axis/kpi-chart-scales.model';
import { appendLabelIcon } from '../optional/kpi-chart-icons.model';


export class KpiLineChartGroup implements IKpiChartGroup {
  active: boolean;
  get size(): number { return this.info.data.length; }
  get data(): KpiChartDatum[] { return this.info.data; }
  get notNullData(): KpiChartDatum[] { return this.info.notNullData; }
  private lineGroup: d3.Selection<d3.BaseType, KpiChartDatum[], SVGGElement, unknown>;
  private pointPositions: Array<{x: number, y: number}>;

  constructor(public container: d3.Selection<SVGGElement, unknown, null, undefined>,
              public pointReferenceContainer: d3.Selection<SVGGElement, unknown, null, undefined>,
              public info: KpiChartGroupInfo,
              private config: KpiChartConfig) {
    this.active = true;
  }

  public calculateStackedValues(stackedGroup: IKpiChartGroup): void { }

  public draw(scales: KpiChartScales): void {
    if (!this.notNullData?.length) return;
    const yScale = this.info.useSecondaryYAxis ? scales.ySecondary : scales.yPrimary;
    this.pointPositions = [];

    this.lineGroup = this.container.selectAll(`g.line-${this.info.groupId}`)
      .data([this.notNullData])
      .join('g')
        .attr('class', `line-${this.info.groupId}`);

    this.lineGroup.selectAll('path')
      .data([this.active ? this.notNullData : []])
      .join('path')
        .attr("fill", "none")
        .attr("stroke", this.info.groupColor || this.notNullData[0].color)
        .attr("stroke-width", 2)
        .attr("d", d3.line<KpiChartDatum>()
          .x((d, i) => {
            const x = scales.getScaledXValue(d);
            this.pointPositions.push({x, y: null});
            return x;
          })
          .y((d, i) => {
            const y = yScale(d.yValue);
            this.pointPositions[i].y = y;
            return y;
          })
        );

    this.lineGroup.selectAll('circle')
      .data(this.active ? this.notNullData : [])
      .join('circle')
        .attr('class', d => `point-${d.pointOrder}`)
        .attr('r', 4)
        .attr('fill', d => d.color || this.info.groupColor)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('cx', (d, i) => this.pointPositions[i].x)
        .attr('cy', (d, i) => this.pointPositions[i].y);
  }

  public drawPointReference(): void {
    this.drawLabels();
  }

  public onMouseOver(index?: number): void {
    if (!this.active || !this.notNullData?.length) return;
    if (index != null) {
      this.lineGroup.select(`circle.point-${index}`).attr('r', 5);
    } else {
      this.lineGroup.selectAll('circle').attr('r', 5);
    }
  }

  public onMouseOut(): void {
    if (!this.active || !this.data?.length) return;
    this.lineGroup.selectAll('circle').attr('r', 4);
  }

  private drawLabels(): void {
    if (!this.info.labelType || !this.notNullData?.length) return;
    const labelGroup = this.pointReferenceContainer.selectAll(`g.line-y-values-${this.info.groupId}`)
      .data([this.notNullData])
      .join('g')
        .attr('class', `line-y-values-${this.info.groupId}`);

    if (this.info.labelType !== 'yoy') {
      labelGroup.selectAll('text')
        .data(this.active ? this.notNullData : [])
        .join('text')
          .attr('x', (d, i) => this.pointPositions[i].x)
          .attr('y', (d, i) => this.pointPositions[i].y - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', d => d.labelColor || d.color || this.info.groupColor)
          .text(d => KpiChartDatum.formatLabel(d, this.info.labelType, this.info.labelValueFormat));
    } else {
      const ctx = this;
      const labelGroups = labelGroup.selectAll('g').data(this.active ? this.notNullData : []);
  
      labelGroups.enter()
        .append('g')
          .attr('transform', (d, i, e) => {
            const currentGroup = d3.select(e[i]);
            appendLabelIcon(currentGroup, d.labelIcon, d.labelColor || d.color || this.info.groupColor);
            ctx.appendText(currentGroup, d);
            const groupLength = currentGroup.node().getBBox().width;
            const x = ctx.pointPositions[i].x;
            const y = this.pointPositions[i].y - 10;
            return `translate(${x - groupLength / 2}, ${y})`;
          });
  
      labelGroups.attr('transform', (d, i, e) => {
        const currentGroup = d3.select(e[i]) as d3.Selection<SVGGElement, unknown, null, undefined>;
        appendLabelIcon(currentGroup, d.labelIcon, d.labelColor || d.color || this.info.groupColor);
        currentGroup.select('text')
          .text(KpiChartDatum.formatLabel(d, this.info.labelType, this.info.labelValueFormat))
          .attr('fill', d.labelColor || d.color || this.info.groupColor);
        const groupLength = currentGroup.node().getBBox().width;
        const x = ctx.pointPositions[i].x;
        const y = this.pointPositions[i].y - 10;
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
      .attr('fill', datum.labelColor || datum.color || this.info.groupColor)
      .style('font-size', '14px');
  }
}