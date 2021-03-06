import * as d3 from 'd3';
import { appendIcon } from "./kpi-chart-icons.model";
import { KpiChartDimensions } from '../data/kpi-chart-dimensions.model';
import { KpiChartConfig } from '../data/kpi-chart-config.model';
import { KpiChartData } from '../data/kpi-chart-data.model';
import { IKpiChartGroup } from '../groups/kpi-chart-group.interface';


export class KpiChartLegend {
  private readonly TEXT_MARGIN = 30;
  private LEGEND_OFFSET;
  private legendGroup: d3.Selection<SVGGElement, unknown, null, IKpiChartGroup>;
  private readonly LEGEND_TEXT_COLOR = '#656565';

  constructor(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
              config: KpiChartConfig,
              private dimensions: KpiChartDimensions,
              private chartData: KpiChartData,
              private updateCharts: Function) {
    this.legendGroup = svg.append('g').attr('class', 'legend')
      .style('font-family', 'MuseoSans300, sans-serif');
    this.LEGEND_OFFSET = config.groupByYear ? 65 : 45;
  }

  public drawLegend(): void {
    const context = this;
    const { width, height } = this.dimensions;
    const { left, top } = this.dimensions.margin;
    const legends = this.legendGroup.selectAll<SVGGElement, IKpiChartGroup>('g.series').data(this.chartData.chartGroups);
    let offset = 0;

    legends.enter().append('g')
      .attr('class', 'series')
      .style('cursor', 'pointer')
      .each(function(group) {
        const textLength = context.appendIconAndAdjustPosition(d3.select(this), group, offset);
        offset += textLength + context.TEXT_MARGIN;
      })
      .on('click', function(e, group) {
        group.active = !group.active;
        d3.select(this).style('opacity', group.active ? 1 : 0.6);
        context.updateCharts(true);
      })
      .on( 'mouseover', (e, group) => group.onMouseOver() )
      .on( 'mouseout', (e, group) => group.onMouseOut() );

    legends.each(function(group) {
      const textLength = context.appendIconAndAdjustPosition(d3.select(this), group, offset);
      offset += textLength + context.TEXT_MARGIN;
    });

    legends.exit()
      .on('click', null)
      .on('mouseover', null)
      .on('mouseout', null)
      .remove();

    const groupOffset = ( width - this.legendGroup.node().getBBox().width ) / 2;
    this.legendGroup.attr('transform', `translate(${left + groupOffset}, ${height + top + this.LEGEND_OFFSET})`);
  }

  public removeAllSeries(): void {
    this.legendGroup.selectAll('g.series').remove();
  }

  public markAllActive(): void {
    this.legendGroup.selectAll('g.series')
      .data(this.chartData.chartGroups)
      .style('opacity', group => {
        group.active = true;
        return 1;
      });
  }

  private appendIconAndAdjustPosition(selection: d3.Selection<SVGGElement, unknown, null, undefined>,
                                      group: IKpiChartGroup,
                                      offset: number): number {
    appendIcon(selection, group.info.groupType, group.info.groupColor || group.data[0].color);
    selection.select('text').remove();
    const text = selection.append('text').text(group.info.groupName)
      .attr('transform', 'translate(20, 0)');
    selection.attr('transform', `translate(${offset}, 0)`)
      .attr('fill', this.LEGEND_TEXT_COLOR)
      .style('font-size', '14px');

    return text.node().getComputedTextLength();
  }
}