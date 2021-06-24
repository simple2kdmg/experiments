export class CanvasChartDatumBase {
    groupId: number;
    xNumberValue: number;
    xDateValue: Date;
    yNumberValue: number;
    color: string;
    /* textLabel: string;
    numericLabel: number;
    labelColor: string;
    labelIcon: string; */
}

export class CanvasChartDatum extends CanvasChartDatumBase {
    x: number;
    y: number;
}