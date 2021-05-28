import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSelectComponent } from './components/custom-select.component';
import { CsDropdownComponent } from './components/cs-dropdown.component';


@NgModule({
  declarations: [
    CustomSelectComponent,
    CsDropdownComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CustomSelectComponent
  ]
})
export class CustomSelectModule { }
