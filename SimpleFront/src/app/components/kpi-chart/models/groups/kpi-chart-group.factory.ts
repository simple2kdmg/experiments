import * as d3 from 'd3';
import { KpiChartGroupInfo } from './kpi-chart-group-info.model';
import { IKpiChartGroup } from './kpi-chart-group.interface';
import { KpiAreaChartGroup } from './kpi-area-chart-group.model';
import { KpiChartConfig } from '../data/kpi-chart-config.model';
import { KpiBarChartGroup } from './kpi-bar-chart-group.model';
import { KpiLineChartGroup } from './kpi-line-chart-group.model';
import { KpiBubbleChartGroup } from './kpi-bubble-chart-group.model';
import { KpiWaterfallChartGroup } from './kpi-waterfall-chart-group.model';


export class KpiChartGroupFactory {
  constructor(private container: d3.Selection<SVGGElement, unknown, null, undefined>,
              private pointReferenceContainer: d3.Selection<SVGGElement, unknown, null, undefined>,
              private config: KpiChartConfig) { }

  public create(groupInfo: KpiChartGroupInfo): IKpiChartGroup {
    switch(groupInfo.groupType) {
      case 'area':
        return new KpiAreaChartGroup(this.container, this.pointReferenceContainer, groupInfo, this.config);
      case 'column':
        return new KpiBarChartGroup(this.container, this.pointReferenceContainer, groupInfo, this.config);
      case 'line':
        return new KpiLineChartGroup(this.container, this.pointReferenceContainer, groupInfo, this.config);
      case 'bubble':
        return new KpiBubbleChartGroup(this.container, this.pointReferenceContainer, groupInfo, this.config);
      case 'waterfall':
        return new KpiWaterfallChartGroup(this.container, this.pointReferenceContainer, groupInfo, this.config);
    }
  }
}