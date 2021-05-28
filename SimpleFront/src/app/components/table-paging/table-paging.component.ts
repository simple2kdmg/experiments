import { Component, ChangeDetectionStrategy,
         Input, Output, EventEmitter } from '@angular/core';


export class PagingInfo {
  page: number;
  maxPage: number;
  recordsPerPage: number;
  recordsCount: number;

  constructor(init?: Partial<PagingInfo>) {
      Object.assign(this, init);
  }

  public static createDefault(): PagingInfo {
      return new PagingInfo({
          page: 1,
          maxPage: null,
          recordsPerPage: 20,
          recordsCount: null
      });
  }
}

@Component({
  selector: 'table-paging',
  templateUrl: './table-paging.component.html',
  styleUrls: ['./table-paging.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablePagingComponent<T> {
  @Input() set data(value: T[]) {
    if (!value) return;
    if (!this.pagingInfo) this.pagingInfo = PagingInfo.createDefault();

    this.allData = value;
    this.spliceData();
  }

  @Output() splicedData = new EventEmitter<T[]>();
  @Output() currentPagingInfo = new EventEmitter<PagingInfo>();

  public pagingInfo: PagingInfo;
  private allData: T[];

  constructor() { }

  public onPrevPageClick(): void {
    this.pagingInfo.page--;
    this.onPageChange();
  }

  public onNextPageClick(): void {
    this.pagingInfo.page++;
    this.onPageChange();
  }

  public onPageChange(): void {
    this.fixPageNumber();
    this.spliceData();
  }

  public onRecordsPerPageChange(): void {
    this.fixRecordsPerPage();
    this.onPageChange();
  }

  private fixPageNumber(): void {
    let fixedPage = Math.floor(this.pagingInfo.page);
    if (fixedPage > this.pagingInfo.maxPage) {
      this.pagingInfo.page = this.pagingInfo.maxPage;
    } else if (fixedPage < 1) {
      this.pagingInfo.page = 1;
    }
  }

  private fixRecordsPerPage(): void {
    const fixedRecordsPerPage = Math.floor(this.pagingInfo.recordsPerPage);
    if (fixedRecordsPerPage > 50) {
      this.pagingInfo.recordsPerPage = 50;
    } else if (fixedRecordsPerPage < 5) {
      this.pagingInfo.recordsPerPage = 5;
    } else {
      this.pagingInfo.recordsPerPage = fixedRecordsPerPage;
    }
    this.pagingInfo.maxPage = Math.ceil(this.pagingInfo.recordsCount / this.pagingInfo.recordsPerPage) || 1;
  }

  private spliceData(): void {
    this.fixRecordsCoundAndMaxPage(this.allData);
    const copy = this.allData.slice();
    const splicedData = copy.splice((this.pagingInfo.page - 1) * this.pagingInfo.recordsPerPage, this.pagingInfo.recordsPerPage);
    this.splicedData.next(splicedData);
    this.currentPagingInfo.next(this.pagingInfo);
  }

  private fixRecordsCoundAndMaxPage(data: T[]): void {
    this.pagingInfo.recordsCount = data.length;
    this.pagingInfo.maxPage = Math.ceil(this.pagingInfo.recordsCount / this.pagingInfo.recordsPerPage) || 1;
  }
}
