import { Component, Input, forwardRef, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Hierarchy } from '../models/hierarchy.model';
import { ISortable } from '../models/sortable.interface';


@Component({
  selector: 'custom-multiselect',
  templateUrl: './custom-multiselect.component.html',
  styleUrls: ['./custom-multiselect.component.scss'],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomMultiselectComponent),
      multi: true
  }]
})
export class CustomMultiselectComponent<T extends ISortable> implements OnChanges, ControlValueAccessor {
  @Input() data: T[];
  @Input() placeholder: string;
  @Input() valueField: string;
  @Input() idField: string;
  @Input() parentIdField: string;
  @Input() hiddenAttrField: string;
  @Input() allDataSelectedByDefault: boolean;
  @Input() dropdownOnTop: boolean;

  public disabled: boolean;
  public text: string;
  public hierarchy: Hierarchy<T>;
  public dropdownOpened: boolean = false;

  constructor(private cdRef: ChangeDetectorRef) {
    this.writeValue = this.writeValue.bind(this);
    this.onError = this.onError.bind(this);
  }

  ngOnChanges(change: SimpleChanges): void {
    if (!this.data || !this.idField) return;
    if (!this.hierarchy) {
      this.hierarchy = new Hierarchy(this.data, this.idField, this.valueField, this.parentIdField, this.hiddenAttrField, this.allDataSelectedByDefault);
    } else if (!this.isEqual(change.data.previousValue, change.data.currentValue)) {
      this.hierarchy.updateAvailable(this.data, this.writeValue);
    }
    this.setText();
  }

  onChange: any = () => {}

  onTouched: any = () => {}

  writeValue(nextSelected: T[]): void {
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
    this.writeValue([]);
    this.dropdownOpened = false;
  }

  public onSelectedChanges(): void {
    this.writeValue( this.hierarchy.getChecked() );
  }

  private onError(text: string) {
    this.onChange(null);
    this.text = text;
    this.disabled = true;
    this.cdRef.markForCheck();
  }

  private setText(): void {
    switch(this.hierarchy?.selected?.length) {
      case(undefined):
      case(null):
      case(0):
        this.text = this.placeholder;
        break;
      case(1):
        this.text = '1 item selected';
        break;
      default:
        this.text = `${this.hierarchy.selected.length} items selected`;
    }
  }

  private isEqual(curr: T[], next: T[]): boolean {
    if (!curr && next) return false;
    if (curr && !next) return false;
    if (!curr && !next) return true;
    return curr.map(x => x[this.idField]).sort((a,b) => a - b).join(',') === next.map(x => x[this.idField]).sort((a,b) => a - b).join(',');
  }

}
