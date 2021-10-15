import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'kpi-toolbar-filter-icon',
  templateUrl: './kpi-toolbar-filter-icon.component.html',
  styleUrls: ['./kpi-toolbar-filter-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiToolbarFilterIconComponent {
  @Input() active: boolean = false;
}
