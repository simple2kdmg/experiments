import { Component, Input, Output, EventEmitter,
         HostListener, ElementRef, ChangeDetectionStrategy,
         ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Hierarchy, DropdownNode } from '../models/hierarchy.model';
import { ISortable } from '../models/sortable.interface';


@Component({
  selector: 'cs-dropdown',
  templateUrl: './cs-dropdown.component.html',
  styleUrls: ['./cs-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsDropdownComponent<T extends ISortable> implements OnDestroy {
  @Input() hierarchy: Hierarchy<T>;
  @Input() valueField: string;
  @Input() parentRef;
  @Input() dropdownOnTop: boolean;
  @Input() hasFilter: boolean;

  @Output() dropdownCloseEvent = new EventEmitter();
  @Output() selectedChanges = new EventEmitter<DropdownNode<T>>();

  @ViewChild('filterInput') set filterInputContent(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if ( !this.parentRef.contains(event.target) && !this.elRef.nativeElement.contains(event.target) ) {
      this.dropdownCloseEvent.next(null);
    }
  }

  constructor(private elRef: ElementRef,
              private cdRef: ChangeDetectorRef) {
    this.rerender = this.rerender.bind(this);
  }

  public rerender(): void {
    this.cdRef.detectChanges();
  }

  public onSelect(node: DropdownNode<T>): void {
    if (!node.selectable) return;
    this.selectedChanges.next(node);
  }

  public onFilterChange(value: string): void {
    this.hierarchy.updateFilter(value, this.rerender);
  }

  ngOnDestroy(): void {
    this.onFilterChange('');
  }

}
