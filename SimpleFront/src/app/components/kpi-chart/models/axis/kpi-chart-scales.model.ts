import * as d3 from 'd3';
import { KpiChartData } from '../data/kpi-chart-data.model';
import { KpiChartConfig } from '../data/kpi-chart-config.model';
import { KpiChartDimensions } from '../data/kpi-chart-dimensions.model';
import { KpiChartDatum } from '../data/kpi-chart-datum.model';


export class KpiChartScales {
  xDate: d3.ScaleTime<number, number>;
  xNumber: d3.ScaleLinear<number, number>;
  xBand: d3.ScaleBand<string>;
  yPrimary: d3.ScaleLinear<number, number>;
  ySecondary: d3.ScaleLinear<number, number>;
  z: d3.ScaleLinear<number, number>;
  xMin: number | Date;
  xMax: number | Date;
  yPrimaryMin: number;
  yPrimaryMax: number;
  ySecondaryMin: number;
  ySecondaryMax: number;
  zMin: number;
  zMax: number;

  private chartData: KpiChartData;
  private cachedXMin: number | Date;
  private cachedXMax: number | Date;
  private cachedYPrimaryMin: number;
  private cachedYPrimaryMax: number;

  constructor(private config: KpiChartConfig, private dimensions: KpiChartDimensions) { }

  public getScaledXValue(datum: KpiChartDatum): number {
    switch(this.config.xAxisType) {
      case 'date':
        return this.xDate(datum.xDateValue);
      case 'band':
        return this.xBand(datum.xBandValue);
      default:
        return this.xNumber(datum.xNumberValue);
    }
  }

  public appendData(chartData: KpiChartData): void {
    this.chartData = chartData;
  }

  public update(): void {
    switch(this.config.xAxisType) {
      case 'date':
        this.setXDateScale();
        break;
      case 'band':
        this.setXBandScale();
        break;
      default:
        this.setXNumberScale();
    }

    if (this.config.yPrimaryAxisType == null) {
      throw new Error('yPrimaryAxisType can not be null or udefined');
    }

    this.setYPrimaryScale();

    if (this.config.ySecondaryAxisType) {
      this.setYSecondaryScale();
    }

    if (this.config.zAxisType) {
      this.setZScale();
    }
  }

  private setXDateScale(): void {
    const [minDate, maxDate] = d3.extent(this.chartData.primaryActiveGroupsData, d => d.xDateValue)
    if (this.config.xAxisMinDateValue) {
      this.xMin = this.config.xAxisMinDateValue;
    } else {
      this.xMin = minDate ? new Date(minDate) : null;
      this.xMin?.setMonth(this.xMin.getMonth() - 1); // so x axis looks nice
    }

    this.xMax = maxDate ? new Date(maxDate) : null;
    this.xMax?.setMonth(this.xMax.getMonth() + 1); // same
    this.cacheXValues();

    this.xDate = d3.scaleTime()
      .domain([this.xMin, this.xMax])
      .range([0, this.dimensions.width]);
  }

  private setXBandScale(): void {
    const bandDomain = this.chartData.primaryActiveGroupsData.map(d => d.xBandValue);
    this.xBand = d3.scaleBand()
      .domain(bandDomain)
      .rangeRound([0, this.dimensions.width]);
  }

  private setXNumberScale(): void {
    const [xMin, xMax] = d3.extent( this.chartData.primaryActiveGroupsData, d => d.xNumberValue );
    this.xMin = this.config.xAxisMinNumberValue ?? xMin;
    this.xMax = xMax;
    this.cacheXValues();

    this.xNumber = d3.scaleLinear()
      .domain([this.xMin, this.xMax])
      .nice()
      .range([0, this.dimensions.width]);
  }

  private setYPrimaryScale(): void {
    if (this.chartData.chartGroups[0].info.groupType === 'waterfall') {
      this.yPrimaryMin = this.chartData.chartGroups[0].info.minYValue;
      this.yPrimaryMax = this.chartData.chartGroups[0].info.maxYValue;
    } else {
      this.yPrimaryMin = this.config.yAxisMinValue ?? d3.min( this.chartData.primaryActiveGroupsData, d => d.yValue );
      this.yPrimaryMax = d3.max( this.chartData.primaryActiveGroupsData, d => d.y0Value ? d.y0Value + d.yValue : d.yValue );
  
      if (this.chartData.largestPrimaryActiveGroup.info.groupType !== 'line' && this.yPrimaryMin > 0) {
        this.yPrimaryMin = 0;
      }
  
      this.cacheYPrimaryValues();
    }

    this.yPrimary = d3.scaleLinear()
      .domain([this.yPrimaryMin, this.yPrimaryMax])
      .nice()
      .range([this.dimensions.height, 0]);
  }

  private setYSecondaryScale(): void {
    this.ySecondaryMin = this.config.yAxisMinValue ?? d3.min( this.chartData.secondaryActiveGroupsData, d => d.yValue );
    this.ySecondaryMax = d3.max( this.chartData.secondaryActiveGroupsData, d => d.y0Value ? d.y0Value + d.yValue : d.yValue );

    if (this.chartData.largestSecondaryActiveGroup.info.groupType !== 'line' && this.ySecondaryMin > 0) {
      this.ySecondaryMin = 0;
    }

    this.ySecondary = d3.scaleLinear()
      .domain([this.ySecondaryMin, this.ySecondaryMax])
      .nice()
      .range([this.dimensions.height, 0]);
  }

  private setZScale(): void {
    this.z = d3.scaleSqrt()
      .domain(d3.extent(this.chartData.primaryActiveGroupsData, d => d.zValue))
      .range([5, this.dimensions.height * 0.7]);
  }

  /**
   * when chart using secondary axis is present, if we toggle off last active chart using primary Y axis,
   * we need to maintain primary Y axis visible (cause secondary Y axis always invisible),
   * so we need cached values to draw axis correctly
   */
  private cacheXValues(): void {
    if (!this.config.ySecondaryAxisType) return;
    if (this.xMin != null) {
      this.cachedXMin = this.xMin;
    } else {
      this.xMin = this.cachedXMin;
    }
    if (this.xMax != null) {
      this.cachedXMax = this.xMax;
    } else {
      this.xMax = this.cachedXMax;
    }
  }

  private cacheYPrimaryValues(): void {
    if (!this.config.ySecondaryAxisType) return;
    if (this.yPrimaryMin != null) {
      this.cachedYPrimaryMin = this.yPrimaryMin;
    } else {
      this.yPrimaryMin = this.cachedYPrimaryMin;
    }
    if (this.yPrimaryMax != null) {
      this.cachedYPrimaryMax = this.yPrimaryMax;
    } else {
      this.yPrimaryMax = this.cachedYPrimaryMax;
    }
  }

}