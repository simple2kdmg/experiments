import { Component, Input, forwardRef, OnChanges, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Hierarchy, DropdownNode } from '../models/hierarchy.model';
import { ISortable } from '../models/sortable.interface';


@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
  }]
})
export class CustomSelectComponent<T extends ISortable> implements OnChanges, ControlValueAccessor {
  @Input() data: T[];
  @Input() placeholder: string;
  @Input() valueField: string;
  @Input() idField: string;
  @Input() parentIdField: string;
  @Input() onlyMaxNested: boolean = false;
  @Input() dropdownOnTop: boolean = false;

  public hasFilter: boolean = false;
  public disabled: boolean;
  public text: string;
  public hierarchy: Hierarchy<T>;
  public dropdownOpened: boolean = false;

  constructor(private cdRef: ChangeDetectorRef) {
    this.writeValue = this.writeValue.bind(this);
    this.onError = this.onError.bind(this);
  }

  ngOnChanges() {
    if (!this.data || !this.idField) return;
    if (this.hierarchy) {
      this.hierarchy.updateAvailable(this.data, this.writeValue);
    } else {
      this.hierarchy = new Hierarchy(this.data, this.idField, this.valueField, this.parentIdField, this.onlyMaxNested);
    }
    this.hasFilter = this.data.length > 12;
    this.setText();
  }

  onChange: any = () => {}

  onTouched: any = () => {}

  writeValue(nextSelected: T): void {
    if (nextSelected === undefined) return;
    this.hierarchy?.updateSelected(nextSelected, this.onError);
    this.setText();
    this.onChange(nextSelected);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public toggleDropdown(): void {
    if (this.disabled || !this.data) return;
    this.dropdownOpened = !this.dropdownOpened;
  }

  public onResetSelection(): void {
    if (this.disabled) return;
    this.dropdownOpened = false;
    this.writeValue(null);
    this.setText();
  }

  public onSelectedChanges(nextSelectedNode: DropdownNode<T>): void {
    this.dropdownOpened = false;
    if (nextSelectedNode.data[this.idField] === this.hierarchy.selectedNode?.data[this.idField]) return;
    this.writeValue(nextSelectedNode.data);
  }

  private onError(text: string) {
    this.onChange(null);
    this.text = text;
    this.disabled = true;
    this.cdRef.markForCheck();
  }

  private setText(): void {
    this.text = this.hierarchy?.selectedNode ? this.hierarchy.selectedNode.data[this.valueField] : this.placeholder;
  }

}
