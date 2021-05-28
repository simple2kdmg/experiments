import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CustomMultiselectModule } from './components/custom-multiselect/custom-multiselect.module';
import { PuzzleSelectModule } from './components/puzzle-select/puzzle-select.module';
import { CustomSelectModule } from './components/custom-select/custom-select.module';
import { CustomSearchModule } from './components/custom-search/custom-search.module';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { KpiChartComponent } from './components/kpi-chart/kpi-chart.component';
import { ButtonClickConfirmDirective } from './directives/button-click-confirm/button-click-confirm.directive';
import { ConfirmButtonComponent } from './directives/button-click-confirm/confirm-button.component';


@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    KpiChartComponent,
    ButtonClickConfirmDirective,
    ConfirmButtonComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    PuzzleSelectModule,
    CustomMultiselectModule,
    CustomSelectModule,
    CustomSearchModule
  ],
  exports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    PuzzleSelectModule,
    LoadingSpinnerComponent,
    CustomMultiselectModule,
    CustomSelectModule,
    CustomSearchModule,
    KpiChartComponent,
    ButtonClickConfirmDirective
  ],
  entryComponents: [
    ConfirmButtonComponent
  ]
})
export class SharedModule { }
