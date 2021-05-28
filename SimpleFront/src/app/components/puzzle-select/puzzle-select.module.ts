import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuzzleSelectComponent } from './components/puzzle-select.component';
import { PuzzleSelectSidebarComponent } from './components/puzzle-select-sidebar.component';



@NgModule({
  declarations: [PuzzleSelectComponent, PuzzleSelectSidebarComponent],
  imports: [
    CommonModule
  ],
  exports: [PuzzleSelectComponent, PuzzleSelectSidebarComponent]
})
export class PuzzleSelectModule { }
