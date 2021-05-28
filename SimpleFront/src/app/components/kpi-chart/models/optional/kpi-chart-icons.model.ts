import * as d3 from 'd3';
import { KpiChartType } from '../data/kpi-chart-type.model';
import { KpiChartLabelIconType } from '../data/kpi-chart-label-icon-type.model';


export function appendIcon(selection: d3.Selection<SVGGElement, unknown, null, undefined>,
                           type: KpiChartType,
                           color: string): d3.Selection<SVGGElement, unknown, null, undefined> {
    selection.select('g').remove();
    const group = selection.append('g').attr('transform', 'translate(0, -15)');
    group.append('path').attr('d', 'M0.985 1.018 L 0.985 18.025').attr('stroke', color).attr('stroke-width', 2).attr('stroke-linecap', 'square');
    group.append('path').attr('d', 'M0.985 18.025 L 17.993 18.025').attr('stroke', color).attr('stroke-width', 2).attr('stroke-linecap', 'square');

    switch(type) {
        case 'area':
            group.append('path').attr('d', 'M17.993 1.018 L 12.979 8.514 7.97 4.554 2.956 10.379 2.956 16.01 17.993 16.01Z').attr('fill', color);
            break;
        case 'column':
            group.append('rect').attr('x', 3.056).attr('y', 6.495).attr('width', 3.068).attr('height', 9.548).attr('fill', color);
            group.append('rect').attr('x', 6.983).attr('y', 3.872).attr('width', 3.068).attr('height', 12.172).attr('fill', color);
            group.append('rect').attr('x', 10.911).attr('y', 1.032).attr('width', 3.068).attr('height', 15.011).attr('fill', color);
            group.append('rect').attr('x', 14.838).attr('y', 5.604).attr('width', 3.068).attr('height', 10.439).attr('fill', color);
            break;
        case 'line':
            group.append('path').attr('d', 'M18 6.5 L 14.4 3 10.8 9.3 7.2 5 2.6 14').attr('stroke', color).attr('stroke-width', 1.5).attr('fill', 'none');
            break;
    }

    return selection;
}

export function appendLabelIcon(selection: d3.Selection<SVGGElement, unknown, null, undefined>, iconType: KpiChartLabelIconType, color): d3.Selection<SVGGElement, unknown, null, undefined> {
    selection.select('path').remove();
    switch (iconType) {
        case 'arrow_up':
            return selection.append('path').attr('d', 'M6.5 -9.75 L12.1292 0 H0.870835 L6.5 -9.75 Z').attr('fill', color);
        case 'arrow_down':
            return selection.append('path').attr('d', 'M6.5 0.25 L0.870834 -9.5 L12.1292 -9.5 L6.5 0.25Z').attr('fill', color);
    }
}

// TODO: for some reasons this brake converting to canvas
/* export function appendIcon(selection: d3.Selection<SVGGElement, unknown, null, undefined>,
                           type: KpiChartType,
                           color: string): d3.Selection<SVGGElement, unknown, null, undefined> {
    switch(type) {
        case 'area':
            selection.html(area(color));
            break;
        case 'column':
            selection.html(column(color));
            break;
        case 'line':
            selection.html(line(color));
            break;
    }

    return selection;
}

const area = (color: string) => `<g transform="translate(0, -15)">
    <path d="M0.985 1.018 L 0.985 18.025" stroke="${color}" stroke-width="2" stroke-linecap="square"></path>
    <path d="M0.985 18.025 L 17.993 18.025" stroke="${color}" stroke-width="2" stroke-linecap="square"></path>
    <path d="M17.993 1.018 L 12.979 8.514 7.97 4.554 2.956 10.379 2.956 16.01 17.993 16.01Z" fill="${color}"</path>
</g>`;

const column = (color: string) => `<g transform="translate(0, -15)">
    <path d="M0.985 1.018 L 0.985 18.025" stroke="${color}" stroke-width="2" stroke-linecap="square"></path>
    <path d="M0.985 18.025 L 17.993 18.025" stroke="${color}" stroke-width="2" stroke-linecap="square"></path>
    <rect x="3.056" y="6.495" width="3.068" height="9.548" fill="${color}"></rect>
    <rect x="6.983" y="3.872" width="3.068" height="12.172" fill="${color}"></rect>
    <rect x="10.911" y="1.032" width="3.068" height="15.011" fill="${color}"></rect>
    <rect x="14.838" y="5.604" width="3.068" height="10.439" fill="${color}"></rect>
</g>`;

const line = (color: string) => `<g transform="translate(0, -15)">
    <path d="M0.985 1.018 L 0.985 18.025" stroke="${color}" stroke-width="2" stroke-linecap="square"></path>
    <path d="M0.985 18.025 L 17.993 18.025" stroke="${color}" stroke-width="2" stroke-linecap="square"></path>
    <path d="M18 6.5 L 14.4 3 10.8 9.3 7.2 5 2.6 14" stroke="${color}" stroke-width="1.5" fill="none"></path>
</g>`; */
