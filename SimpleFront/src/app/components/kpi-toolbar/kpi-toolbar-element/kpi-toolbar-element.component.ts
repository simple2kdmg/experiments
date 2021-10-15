import { Component, ContentChild, Input, TemplateRef } from '@angular/core';


@Component({
  selector: 'kpi-toolbar-element',
  template: ''
})
export class KpiToolbarElementComponent {
  @Input() title: string = '';

  @ContentChild("info") infoRef: TemplateRef<any>;
  @ContentChild("select") selectRef: TemplateRef<any>;
  @ContentChild("wholeSelect") wholeSelectRef: TemplateRef<any>;

  public showSelect: boolean;
  public paddingLeft: number;
}
