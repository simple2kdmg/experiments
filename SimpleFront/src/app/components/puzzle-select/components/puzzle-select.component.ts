import { Component, OnChanges, Input,
         forwardRef, ViewChild, OnDestroy, ElementRef,
         ChangeDetectorRef, ChangeDetectionStrategy,
         ViewChildren, QueryList } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ISortable } from '../models/sortable.interface';
import { Tree } from '../models/tree.model';


@Component({
  selector: 'puzzle-select',
  templateUrl: './puzzle-select.component.html',
  styleUrls: ['./puzzle-select.component.scss'],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PuzzleSelectComponent),
      multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PuzzleSelectComponent<T extends ISortable> implements OnChanges, OnDestroy {
  @Input() available: T[];
  @Input() valueField: string;
  @Input() idField: string;
  @Input() parentIdField: string;

  @ViewChild('puzzleContainer') set puzzleContent(content: ElementRef) {
    if (content && !this.puzzleContainer) {
      this.puzzleContainer = content.nativeElement;
      this.puzzleContainer.addEventListener('mouseenter', this.onSelectedPuzzleHover, false);
      this.puzzleContainer.addEventListener('mouseleave', this.hideDropdown, false);
    }
  };

  @ViewChild('dropdown') set dropdownContent(content: ElementRef) {
    if (content && !this.dropdown) {
      this.dropdown = content.nativeElement;
      this.dropdown.addEventListener('mouseenter', this.onDropdownHover, false);
      this.dropdown.addEventListener('mouseleave', this.hideDropdown, false);
    }
  };

  @ViewChildren('ul', { read: ElementRef }) set sectionsContent(content: QueryList<ElementRef>) {
    if (content && content.length === this.tree?.nodes.length) {
      this.sections = content.map(elem => elem.nativeElement);
    }
  }

  public maxDropdownWidth;
  public maxDropdownHeight;
  public dropdownWidth;
  public puzzles: T[];
  public tree: Tree<T>;
  public dropdownVisible: boolean;

  private sections: HTMLUListElement[];
  private initialSectionsWidth: number[];
  private puzzleContainer: HTMLDivElement;
  private dropdown: HTMLDivElement;

  constructor(private cdRef: ChangeDetectorRef) {
    this.onSelectedPuzzleHover = this.onSelectedPuzzleHover.bind(this);
    this.onDropdownHover = this.onDropdownHover.bind(this);
    this.hideDropdown = this.hideDropdown.bind(this);
  }

  ngOnChanges(): void {
    if (!this.available || !this.valueField || !this.idField || !this.parentIdField) return;
    this.tree = new Tree(this.available, this.valueField, this.idField, this.parentIdField);
  }

  ngOnDestroy(): void {
    this.puzzleContainer.removeEventListener('mouseenter', this.onSelectedPuzzleHover);
    this.puzzleContainer.removeEventListener('mouseleave', this.hideDropdown);
    this.dropdown.removeEventListener('mouseenter', this.onDropdownHover);
    this.dropdown.removeEventListener('mouseleave', this.hideDropdown);
  }

  onChange: any = () => {}

  onTouched: any = () => {}

  writeValue(nextSelected: T): void {
    if (!nextSelected) return;
    this.updateTiles(nextSelected);
    this.cdRef.detectChanges();
    this.onChange(nextSelected);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public switchTo(puzzle: T): void {
    this.dropdownVisible = false;
    this.writeValue(puzzle);
  }

  private onSelectedPuzzleHover(): void {
    if (!this.sections) return;
    this.setMaxHeightAndWidth();
    this.dropdownVisible = true;
    this.cdRef.detectChanges();
    this.calculateInitialSectionsWidth();
    this.calculateDropdownWidth();
    this.cdRef.detectChanges();
  }

  private onDropdownHover(): void {
    this.dropdownVisible = true;
    this.cdRef.detectChanges();
  }

  private hideDropdown(): void {
    this.dropdownVisible = false;
    this.cdRef.detectChanges();
  }

  private updateTiles(nextSelected: T): void {
    this.puzzles = [];
    let selected = nextSelected;

    do {
      this.puzzles.unshift(selected);
      selected = this.available.find( elem => elem[this.idField] === selected[this.parentIdField] );
    } while (selected != null);
  }

  private setMaxHeightAndWidth(): void {
    const { innerHeight: winHeight, innerWidth: winWidth } = window;
    this.maxDropdownWidth = 0.5 * winWidth;
    this.maxDropdownHeight = 0.8 * winHeight;
  }

  private calculateInitialSectionsWidth(): void {
    if (this.initialSectionsWidth?.length === this.sections.length) return;
    this.initialSectionsWidth = [];
    this.sections.forEach(section => this.initialSectionsWidth.push(section.offsetWidth));
  }

  private calculateDropdownWidth(): void {
    let currentColumnHeight = 0;
    let currentColumnWidth = 0;
    let dropdownWidth = 0;

    this.sections.forEach((section, index) => {
      if (currentColumnHeight + section.offsetHeight < this.maxDropdownHeight) {
        currentColumnHeight += section.offsetHeight;
        currentColumnWidth = Math.max(currentColumnWidth, this.initialSectionsWidth[index]);
      } else {
        dropdownWidth += currentColumnWidth + this.initialSectionsWidth[index];
        currentColumnHeight = 0;
        currentColumnWidth = 0;
      }
    });

    if (currentColumnHeight > 0) dropdownWidth += currentColumnWidth;
    this.dropdownWidth = dropdownWidth + 40;
  }

}
