import { KpiChartConfig } from "../components/kpi-chart/models/data/kpi-chart-config.model";
import { KpiChartRequestedDatum } from "../components/kpi-chart/models/data/kpi-chart-datum.model";
import { KpiChartRequestedGroupInfo } from "../components/kpi-chart/models/groups/kpi-chart-group-info.model";

export const waterfallChartConfig = new KpiChartConfig({
    containerWidth: 800,
    containerHeight: 200,
    xAxisType: 'band',
    yAxisStep: 2,
    yPrimaryAxisType: 'numeric',
    hasTooltips: true
});

export const waterfallChartGroup = new KpiChartRequestedGroupInfo({
    groupId: 1,
    groupName: 'Waterfall-test',
    groupType: 'waterfall',
    groupOrder: 1,
    groupColor: 'green',
    useSecondaryYAxis: false,
    stackedGroupId: null,
    shift: 0,
    labelType: null,
    labelValueFormat: '',
    data: [
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: 'Start', yValue: 100, color: 'grey' }),
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: 'Band-2', yValue: 20, color: 'green' }),
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: 'Band-3', yValue: 60, color: 'green' }),
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: 'Band-4', yValue: -80, color: 'red' }),
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: 'Band-5', yValue: 40, color: 'green' }),
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: 'Band-6', yValue: 60, color: 'green' }),
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: 'End', yValue: 200, color: 'grey' }),
    ]
});