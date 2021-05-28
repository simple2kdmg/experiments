import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSearchComponent } from './components/custom-search.component';
import { CsrDropdownComponent } from './components/csr-dropdown.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
  CustomSearchComponent,
  CsrDropdownComponent
],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CustomSearchComponent
  ]
})
export class CustomSearchModule { }
