import { KpiChartDimensions } from "../data/kpi-chart-dimensions.model";
import { KpiChartScales } from "../axis/kpi-chart-scales.model";
import { KpiChartConfig } from "../data/kpi-chart-config.model";
import { KpiChartData } from "../data/kpi-chart-data.model";


export class KpiChartBand {
  x0Value: number | Date;
  x1Value: number | Date;
  color: string;
  opacity: number;

  constructor(init?: Partial<KpiChartBand>) {
    Object.assign(this, init);
  }

  public apply(bandGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
               config: KpiChartConfig,
               chartData: KpiChartData,
               dimensions: KpiChartDimensions,
               scales: KpiChartScales): void {
    if (!this.x0Value && !this.x1Value) return;

    let { xMin, xMax } = scales;
    if (config.xAxisType === 'date') { // we have to correct boundaries, if x axis type is 'date'
      xMin = new Date(xMin);
      xMin.setMonth(xMin.getMonth() + 1);
      xMax = new Date(xMax);
      xMax.setMonth(xMax.getMonth() - 1);
    }

    let x0 = this.x0Value ?? xMin;
    let x1 = this.x1Value ?? xMax;
    x0 = +this.x0Value <= +xMin ? xMin : this.x0Value;
    x1 = +this.x1Value >= +xMax ? xMax : this.x1Value;

    if (+x0 === +x1) return;
    
    let scaledX0 = scales.x(x0);
    let scaledX1 = scales.x(x1);

    // need to adjust boundaries according to chart's shift, so they are not outside band
    if (x0 !== xMin) { 
      const shiftLeft = (Math.min(...chartData.chartGroups.map(g => g.info.shift)) - 2) * config.barWidth / 4;
      scaledX0 += shiftLeft < 0 ? shiftLeft : 0;
    }
    if (x1 !== xMax) {
      const shiftRight = (Math.max(...chartData.chartGroups.map(g => g.info.shift)) - 2) * config.barWidth / 4;
      scaledX1 += shiftRight > 0 ? shiftRight : 0;
    }

    const x = scaledX0 < scales.x(xMin) ? scales.x(xMin) : scaledX0;
    let width = scaledX1 > scales.x(xMax) ? scales.x(xMax) - x : scaledX1 - x;
    width = width < 0 ? 0 : width;

    bandGroup.selectAll('rect')
      .data([this])
      .join('rect')
        .attr('x', x)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', dimensions.height)
        .style('fill', this.color)
        .style('opacity', this.opacity);
  }
}