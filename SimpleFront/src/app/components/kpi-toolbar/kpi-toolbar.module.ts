import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiToolbarElementComponent } from './kpi-toolbar-element/kpi-toolbar-element.component';
import { KpiToolbarComponent } from './kpi-toolbar.component';
import { KpiToolbarFilterIconComponent } from './kpi-toolbar-filter-icon/kpi-toolbar-filter-icon.component';



@NgModule({
  declarations: [
    KpiToolbarElementComponent,
    KpiToolbarComponent,
    KpiToolbarFilterIconComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    KpiToolbarElementComponent,
    KpiToolbarComponent
  ]
})
export class KpiToolbarModule { }
