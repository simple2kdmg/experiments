import { Component, ContentChildren, QueryList } from '@angular/core';
import { KpiToolbarElementComponent } from './kpi-toolbar-element/kpi-toolbar-element.component';


@Component({
  selector: 'kpi-toolbar',
  templateUrl: './kpi-toolbar.component.html',
  styleUrls: ['./kpi-toolbar.component.scss']
})
export class KpiToolbarComponent {
  @ContentChildren(KpiToolbarElementComponent) toolbarElements: QueryList<KpiToolbarElementComponent>;

  public showWholeSelect: boolean;

  public toggleWholeSelect(): void {
    this.showWholeSelect = !this.showWholeSelect;
    this.toolbarElements.forEach(element => element.showSelect = false);
  }

  public onElementClick(element: KpiToolbarElementComponent, container: HTMLDivElement): void {
    element.paddingLeft = container.getBoundingClientRect().left;
    if (element.showSelect) {
      element.showSelect = false;
    } else {
      this.toolbarElements.forEach( element => element.showSelect = false );
      element.showSelect = true;
      this.showWholeSelect = false;
    }
  }
}
