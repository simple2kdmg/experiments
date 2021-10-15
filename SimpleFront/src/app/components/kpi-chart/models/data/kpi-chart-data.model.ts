import { KpiChartDatum } from './kpi-chart-datum.model';
import { KpiChartConfig } from './kpi-chart-config.model';
import { KpiChartDimensions } from './kpi-chart-dimensions.model';
import { IKpiChartGroup } from '../groups/kpi-chart-group.interface';
import { KpiChartGroupFactory } from '../groups/kpi-chart-group.factory';
import { KpiChartRequestedGroupInfo, KpiChartGroupInfo } from '../groups/kpi-chart-group-info.model';


export class KpiChartData {
  all: KpiChartDatum[];
  maxYValue: number;
  chartGroups: IKpiChartGroup[];
  activeGroups: IKpiChartGroup[];
  largestActiveGroup: IKpiChartGroup;
  largestPrimaryActiveGroup: IKpiChartGroup; // group with largest number of points to get tick number (using primary Y axis)
  largestSecondaryActiveGroup: IKpiChartGroup; // group with largest number of points to get tick number (using secondary Y axis)
  primaryActiveGroupsData: KpiChartDatum[]; // to calculate primary axis boundaries
  secondaryActiveGroupsData: KpiChartDatum[]; // to calculate secondary axis boundaries
  private groupFactory: KpiChartGroupFactory;
  private chartGroupsMap: Map<number, IKpiChartGroup>;

  constructor(mainContainer: d3.Selection<SVGGElement, unknown, null, undefined>,
              pointReferenceContainer: d3.Selection<SVGGElement, unknown, null, undefined>,
              private config: KpiChartConfig,
              private dimensions: KpiChartDimensions) {
    this.groupFactory = new KpiChartGroupFactory(mainContainer, pointReferenceContainer, config);
    this.chartGroupsMap = new Map<number, IKpiChartGroup>();
  }

  public update(requestedGroupInfos: KpiChartRequestedGroupInfo[]): void {
    this.updateChartGroups(requestedGroupInfos);
    this.updateAllData();
    this.updateActiveGroups();
  }

  public updateActiveGroups(): void {
    this.calculateAllStackedValues();
    this.distributeActiveGroups();
  }

  public adjustBarWidth(): void {
    const nonstackedBarChartsCount = this.chartGroups.filter(g => !g.info.stackedGroupId && g.info.groupType == 'column').length;
    if (nonstackedBarChartsCount === 0) return;
    // Date scale have 2 extra ticks, therefore tick count increased by 2
    const dateScaleCorrection = this.config.xAxisType === 'date' ? 2 : 0;
    const tickIntervalsCount = this.largestActiveGroup.size + dateScaleCorrection - 1;
    const availableBarWidth = 0.7 * this.dimensions.width / tickIntervalsCount / nonstackedBarChartsCount;
    if (availableBarWidth > 25) {
      this.config.barWidth = 25;
    } else if (availableBarWidth < 10) {
      this.config.barWidth = 10;
    } else {
      this.config.barWidth = availableBarWidth;
    }
  }

  private updateChartGroups(requestedGroupInfos: KpiChartRequestedGroupInfo[]): void {
    const nextChartGroupsMap = new Map<number, IKpiChartGroup>();

    this.chartGroups = requestedGroupInfos.map(i => {
      const info = new KpiChartGroupInfo(i, this.config);
      let group: IKpiChartGroup;
      if (!i.data) {
        throw new Error(`There are no data for chart group [${info.groupName}] with Id = ${info.groupId}.`);
      }

      if (this.chartGroupsMap.has(info.groupId)) { // update group
        group = this.chartGroupsMap.get(info.groupId);
        Object.assign(group.info, info);
      } else { // create group
        group = this.groupFactory.create(info);
        group.active = true;
      }

      nextChartGroupsMap.set(info.groupId, group);
      return group;
    }).sort((g1, g2) => g1.info.groupOrder - g2.info.groupOrder);

    this.chartGroupsMap = nextChartGroupsMap;
  }

  private updateAllData(): void {
    this.maxYValue = Math.max(...this.chartGroups.flatMap(g => g.info.maxYValue));
    this.all = this.chartGroups.flatMap(g => g.info.data);
  }

  private calculateAllStackedValues(): void {
    this.chartGroups.forEach((group, i, all) => {
      const stackedGroup = group.info.stackedGroupId ?
        all.find(g => g.info.groupId === group.info.stackedGroupId) : null;
      group.calculateStackedValues(stackedGroup);
    });
  }

  private distributeActiveGroups(): void {
    const allActiveGroups = [];
    const primaryActiveGroups = [];
    const secondaryActiveGroups = [];
    let maxPrimaryGroupSize = 0;
    let maxSecondaryGroupSize = 0;

    this.chartGroups.forEach(g => {
      if (!g.active) {
        return;
      } else if (!g.info.useSecondaryYAxis) {
        primaryActiveGroups.push(g);
        if (g.size > maxPrimaryGroupSize) {
          maxPrimaryGroupSize = g.size;
          this.largestPrimaryActiveGroup = g;
        }
      } else {
        secondaryActiveGroups.push(g);
        if (g.size > maxSecondaryGroupSize) {
          maxSecondaryGroupSize = g.size;
          this.largestSecondaryActiveGroup = g;
        }
      }
      allActiveGroups.push(g);
    });

    this.activeGroups = allActiveGroups;

    if (!this.largestSecondaryActiveGroup) {
      this.largestActiveGroup = this.largestPrimaryActiveGroup;
    } else {
      this.largestActiveGroup = this.largestPrimaryActiveGroup.size > this.largestSecondaryActiveGroup.size ?
        this.largestPrimaryActiveGroup : this.largestSecondaryActiveGroup;
    }

    this.primaryActiveGroupsData = primaryActiveGroups.flatMap(g => g.data);
    this.secondaryActiveGroupsData = secondaryActiveGroups.flatMap(g => g.data);
  }
}