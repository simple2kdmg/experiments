import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ElementRef, HostListener } from '@angular/core';


@Component({
  selector: 'csr-dropdown',
  templateUrl: './csr-dropdown.component.html',
  styleUrls: ['./csr-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsrDropdownComponent<T> {
  @Input() filteredData: T[];
  @Input() resultField: string;
  @Input() infoFields: string[];
  @Input() parentRef;
  @Output() clickOutsideEvent = new EventEmitter();
  @Output() itemSelectEvent = new EventEmitter<T>();

  constructor(private elRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if ( !this.parentRef.contains(event.target) && !this.elRef.nativeElement.contains(event.target) ) {
      this.clickOutsideEvent.next(null);
    }
  }

  public selectItem(item: T): void {
    this.itemSelectEvent.next(item);
  }

}
