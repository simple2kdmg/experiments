import { ChangeDetectionStrategy, ChangeDetectorRef,
         Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'confirmable-button',
  templateUrl: './confirmable-button.component.html',
  styleUrls: ['./confirmable-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmableButtonComponent {
  @Input() icon: string;
  @Input() text: string = '';
  @Input() countdownTime: number = 5;
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() disabled: boolean;
  @Input() primary: boolean;

  @Output() pending = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();

  public confirmMode: boolean;
  public countdown: number;
  private intervalId: ReturnType<typeof setInterval>;

  constructor(private cdRef: ChangeDetectorRef) { }

  public onMainButtonClick(): void {
    this.toggleMode(true);
    this.countdown = this.countdownTime;
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(this.intervalId);
        this.onCancel();
      }
      this.cdRef.detectChanges();
    }, 1000);
  }

  public onConfirm(): void {
    this.toggleMode(true);
    this.confirm.next();
  }

  public onCancel(): void {
    this.toggleMode(false);
  }

  private toggleMode(value: boolean): void {
    this.confirmMode = value;
    this.pending.next(value);
  }

}
