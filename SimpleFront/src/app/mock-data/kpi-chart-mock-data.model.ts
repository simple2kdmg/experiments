import { KpiChartConfig } from "../components/kpi-chart/models/data/kpi-chart-config.model";
import { KpiChartRequestedDatum } from "../components/kpi-chart/models/data/kpi-chart-datum.model";
import { KpiChartRequestedGroupInfo } from "../components/kpi-chart/models/groups/kpi-chart-group-info.model";

export const waterfallChartConfig = new KpiChartConfig({
    containerWidth: 800,
    containerHeight: 200,
    xAxisType: 'band',
    //yAxisStep: 2,
    yPrimaryAxisType: 'numeric',
    xTicksOff: true,
    hasTooltips: true
});

export const waterfallChartGroup = new KpiChartRequestedGroupInfo({
    groupId: 1,
    groupName: 'Waterfall-test',
    groupType: 'waterfall',
    groupOrder: 1,
    groupColor: 'grey',
    useSecondaryYAxis: false,
    stackedGroupId: null,
    shift: 0,
    labelType: null,
    labelValueFormat: '',
    data: [
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: '2020', yValue: -100, color: 'grey', isSpecial: true }),
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: 'Band-2', yValue: 50, color: 'green' }),
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: 'Band-3', yValue: 100, color: 'green' }),
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: '2021', yValue: 50, color: 'grey', isSpecial: true }),
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: 'Band-5', yValue: 100, color: 'green' }),
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: 'Band-6', yValue: 50, color: 'green' }),
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: 'Band-7', yValue: -100, color: 'red' }),
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: 'Band-8', yValue: 150, color: 'green' }),
        new KpiChartRequestedDatum({ groupId: 1, xBandValue: '2022', yValue: 300, color: 'grey', isSpecial: true }),
    ]
});