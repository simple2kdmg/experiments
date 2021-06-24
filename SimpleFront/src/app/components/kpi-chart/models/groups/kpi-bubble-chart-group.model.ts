import * as d3 from 'd3';
import { KpiChartDatum } from '../data/kpi-chart-datum.model';
import { KpiChartGroupInfo } from './kpi-chart-group-info.model';
import { IKpiChartGroup } from './kpi-chart-group.interface';
import { KpiChartScales } from '../axis/kpi-chart-scales.model';
import { KpiChartConfig } from '../data/kpi-chart-config.model';


export class KpiBubbleChartGroup implements IKpiChartGroup {
  active: boolean;
  get size(): number { return this.info.data.length; }
  get data(): KpiChartDatum[] { return this.info.data; }
  private bubbleGroup: d3.Selection<d3.BaseType, KpiChartDatum[], SVGGElement, unknown>;
  private pointPositions: Array<{x: number, y: number, r: number}>;

  constructor(public container: d3.Selection<SVGGElement, unknown, null, undefined>,
              public pointReferenceContainer: d3.Selection<SVGGElement, unknown, null, undefined>,
              public info: KpiChartGroupInfo,
              private config: KpiChartConfig) {
    this.active = true;
  }

  public calculateStackedValues(stackedGroup: IKpiChartGroup): void { }

  public draw(scales: KpiChartScales): void {
    if (!this.data?.length) return;
    this.pointPositions = [];

    this.bubbleGroup = this.container.selectAll(`g.bubbles-${this.info.groupId}`)
      .data([this.data])
      .join('g')
        .attr('class', `bubbles-${this.info.groupId}`);

    this.bubbleGroup.selectAll('circle')
      .data(this.active ? this.data : [])
      .join('circle')
        .attr('class', (d, i) => `bubble-${i}`)
        .attr('r', d => {
            const r = scales.z(d.zValue);
            this.pointPositions.push({x: null,y: null, r});
            return r;
        })
        .attr('fill', d => d.color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('opacity', 0.8)
        .attr('cx', (d, i) => {
            const x = scales.getScaledXValue(d);
            this.pointPositions[i].x = x;
            return x;
        })
        .attr('cy', (d, i) => {
            const y = scales.yPrimary(d.yValue);
            this.pointPositions[i].y = y;
            return y;
        });
  }

  public drawPointReference(): void {
    if (!this.data?.length) return;
  }

  public onMouseOver(index?: number): void {
    if (!this.active || !this.data?.length) return;
    if (index != null) {
      this.bubbleGroup.select(`circle.bubble-${index}`).style('opacity', null);
    } else {
      this.bubbleGroup.selectAll('circle').style('opacity', null);
    }
  }

  public onMouseOut(): void {
    if (!this.active || !this.data?.length) return;
    this.bubbleGroup.selectAll('circle').style('opacity', 0.8);
  }
}