import { Component, Input, forwardRef,
         ChangeDetectionStrategy, ChangeDetectorRef,
         ViewChild, ElementRef, AfterViewInit,
         OnDestroy, Output, EventEmitter} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';


/**
 * @resultField field to be shown in dropdown list.
 * @infoFields additional info shown in dropdown list with a separator '|'.
 */
@Component({
  selector: 'custom-search',
  templateUrl: './custom-search.component.html',
  styleUrls: ['./custom-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSearchComponent),
      multi: true
  }]
})
export class CustomSearchComponent<T> implements AfterViewInit, OnDestroy {
  @Input() data: T[];
  @Input() resultField: string;
  @Input() infoFields: string[] = [];
  @Input() isDisabled: boolean;
  @Input() disableDropdown: boolean;
  @Output() filterChange = new EventEmitter<string>();
  @ViewChild('input') input: ElementRef;

  public dropdownVisible: boolean = false;
  public filteredData: T[];

  private propNames: string[];
  private timerId;

  constructor(private cdRef: ChangeDetectorRef) {
    this.onInput = this.onInput.bind(this);
    this.onInputClick = this.onInputClick.bind(this);
  }

  ngAfterViewInit() {
    this.input.nativeElement.addEventListener('input', this.onInput);
    this.input.nativeElement.addEventListener('click', this.onInputClick);
  }

  ngOnDestroy() {
    this.input.nativeElement.removeEventListener('input', this.onInput);
    this.input.nativeElement.removeEventListener('input', this.onInputClick);
  }

  onChange: any = () => {}

  onTouched: any = () => {}

  writeValue(nextSelected: T): void {
    if (!nextSelected && this.input) {
      this.input.nativeElement.value = '';
      this.onInput();
      return;
    }
    this.onChange(nextSelected);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public onItemSelect(item: T): void {
    this.writeValue(item);
    this.input.nativeElement.value = item[this.resultField];
    this.dropdownVisible = false;
  }

  public onClickOutside(): void {
    this.dropdownVisible = false;
  }

  private onInputClick(): void {
    if (!this.filteredData?.length || !this.input.nativeElement.value) return;
    this.dropdownVisible = true;
    this.cdRef.markForCheck();
  }

  private onInput(): void {
    let value = this.input.nativeElement.value;
    value = value.trim().toLowerCase();
    this.filterChange.next(value);
    if (!this.data?.length || this.disableDropdown) return;
    if (!value) {
      this.filteredData = [];
      return;
    }
    this.setUpPropNames();
    this.setFilteredData(value);
  }

  private setFilteredData(value: string): void {
    if (this.timerId) clearTimeout(this.timerId);

    this.timerId = setTimeout(() => {
      this.filteredData = this.data.filter( obj => 
        this.propNames.some( prop => obj[prop]?.toString().toLowerCase().includes(value) )
      );
      this.dropdownVisible = !!this.filteredData.length;
      this.cdRef.markForCheck();
    }, 1000);
  }

  private setUpPropNames(): void {
    if (this.propNames) return;
    this.propNames = Object.keys(this.data[0]);
  }

}
