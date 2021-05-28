import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';


@Component({
  template: `
    <button [hidden]="hidden" (click)="confirm()">Are you sure? ({{ countDown }})</button>
  `,
  //styles: ['button { background-color: red; color: white; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmButtonComponent implements OnInit {
  public hidden: boolean = true;
  public secondsForCancel: number = 5;
  public onConfirm = new ReplaySubject<void>(1);
  public onCancel = new ReplaySubject<void>(1);

  public countDown: number;
  private timerId: ReturnType<typeof setInterval>;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    
  }

  public startCountdown(): void {
    this.countDown = this.secondsForCancel;
    this.cdRef.detectChanges();
    this.timerId = setInterval(() => {
      this.countDown--;
      if (this.countDown === 0) {
        clearInterval(this.timerId);
        this.onCancel.next();
        this.hidden = true;
      }
      this.cdRef.detectChanges();
    }, 1000);
  }

  public confirm(): void {
    this.hidden = true;
    this.onConfirm.next();
    this.cdRef.detectChanges();
  }

}
