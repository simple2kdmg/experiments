import * as d3 from 'd3';
import { KpiChartData } from '../data/kpi-chart-data.model';
import { KpiChartScales } from '../axis/kpi-chart-scales.model';
import { KpiChartConfig } from '../data/kpi-chart-config.model';
import { KpiChartDimensions } from '../data/kpi-chart-dimensions.model';
import { KpiChartDatum } from '../data/kpi-chart-datum.model';


export class KpiChartTooltip {
    private tooltipGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
    private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, undefined>;
    private table: d3.Selection<HTMLTableElement, unknown, HTMLElement, undefined>;
    private tooltipWidth: number;
    private tooltipHeight: number;
    private appearanceTimeout: ReturnType<typeof setTimeout>;

    constructor(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
                container: HTMLDivElement,
                private config: KpiChartConfig,
                private dimensions: KpiChartDimensions,
                private chartData: KpiChartData,
                private scales: KpiChartScales) {
      const context = this;
      this.tooltipGroup = svg.append('g')
        .attr('class', 'tooltip-anchors')
        .style('font-family', 'MuseoSans300, sans-serif')
        .on('mouseover', function(e) {
          if (context.appearanceTimeout) clearTimeout(context.appearanceTimeout);
          context.appearanceTimeout = setTimeout(() => context.show(e), 150);
        })
        .on('mouseout', () => this.hide());
      this.tooltip = d3.select(container).append('div')
        .style('position', 'absolute')
        .style('padding', '6px 8px')
        .style('opacity', 0)
        .style('border', '1px solid #d4d4d4')
        .style('background-color', '#f6f6f6');
      this.table = this.tooltip.append('table')
        .style('font-size', '14px');
    }

    public updateTooltip(): void {
      this.tooltipGroup.attr('transform', `translate(${this.dimensions.margin.left}, ${this.dimensions.margin.top})`);

      const areasWidths = this.getTooltipAreasWidths();
      const rects = this.tooltipGroup.selectAll('rect')
        .data(this.chartData.largestActiveGroup.data);

      rects.enter().append('rect')
        .style('opacity', 0)
        .attr('order', (d, i) => i)
        .attr('width', (d, i) => areasWidths[i])
        .attr('height', this.dimensions.height )
        .attr('x', (d, i) => {
          const x = this.scales.getScaledXValue(d) - areasWidths[i] / 2;
          return this.config.xAxisType === 'band' ? x + this.scales.xBand.bandwidth() / 2 : x;
        })
        .attr('y', 0);

      rects.attr('order', (d, i) => i)
        .attr('width', (d, i) => areasWidths[i])
        .attr('height', this.dimensions.height )
        .attr('x', (d, i) => this.scales.getScaledXValue(d) - areasWidths[i] / 2);

      rects.exit().remove();
    }

    /**
     * Defines widths of areas around points, which trigger showing tooltip.
     */
    private getTooltipAreasWidths(): number[] {
      return this.chartData.largestActiveGroup.data.map((d, i, all) => {
        let width;
        if (i == 0) {
          width = ( this.scales.getScaledXValue(all[i + 1]) - this.scales.getScaledXValue(d) );
        } else if (i == all.length - 1) {
          width = ( this.scales.getScaledXValue(d) - this.scales.getScaledXValue(all[i - 1]) );
        } else {
          const toNext = this.scales.getScaledXValue(all[i + 1]) - this.scales.getScaledXValue(d);
          const toPrev = this.scales.getScaledXValue(d) - this.scales.getScaledXValue(all[i - 1]);
          width = d3.min([toPrev, toNext]);
        }
        return width < 0 ? 0 : width;
      });
    }

    private updateTooltipText(index: number): void {
      const datum = this.chartData.activeGroups[0].data[index];
      const xValue = datum.xDateValue || datum.xNumberValue || datum.xBandValue;
      const groupLabel = this.config.xAxisType === 'date' ? d3.timeFormat("%B, %Y")(xValue as Date) : xValue;
      let text = `<tr><td colspan="3" style="text-align: center; font-weight: bold;">${groupLabel}</td></tr>`;

      text += this.chartData.activeGroups.reduce((res, curr) => {
        const value = curr.data[index]?.yValue == null ? '-' :
          KpiChartDatum.formatTooltipYValue(curr.data[index].yValue, this.config, curr.info.useSecondaryYAxis);
        return res += `<tr>
          <td><div style="width: 14px; height: 3px; background-color: ${curr.info.groupColor || curr.data[0].color};"></div></td>
          <td style="padding: 0 8px;">${curr.info.groupName}</td>
          <td>${value}</td>
        </tr>`
      }, '');

      this.table.html(text);
    }

    private updateTooltipDimensions(): void {
      const tooltipNode = this.tooltip.node();
      this.tooltipWidth = tooltipNode.offsetWidth;
      this.tooltipHeight = tooltipNode.offsetHeight;
    }

    private show(event: MouseEvent): void {
      const index = +(event.target as SVGRectElement).getAttribute('order');
      if (index == null) return;
      const relativeTarget = this.tooltipGroup.node();
      this.updateTooltipText(index);
      this.updateTooltipDimensions();
      this.chartData.activeGroups.forEach(g => g.onMouseOver(index));
      this.tooltip
        .style('left', () => {
          const x = d3.pointer(event, relativeTarget)[0] + this.dimensions.margin.left - this.tooltipWidth - 5;
          return x < 0 ? 0 : x + 'px';
        })
        .style('top', () => {
          const y = d3.pointer(event, relativeTarget)[1] + this.dimensions.margin.top - this.tooltipHeight - 5;
          return y < 0 ? 0 : y + 'px';
        })
        .style('opacity', 1);
    }

    private hide(): void {
      if (this.appearanceTimeout) {
        clearTimeout(this.appearanceTimeout);
      }
      this.tooltip.style('opacity', 0)
        .style('left', -this.tooltipWidth + 'px')
        .style('top', -this.tooltipHeight + 'px');
      this.chartData.activeGroups.forEach(g => g.onMouseOut());
    }
}