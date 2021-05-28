import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMultiselectComponent } from './components/custom-multiselect.component';
import { CmDropdownComponent } from './components/cm-dropdown.component';


@NgModule({
  declarations: [
    CustomMultiselectComponent,
    CmDropdownComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CustomMultiselectComponent
  ]
})
export class CustomMultiselectModule { }
