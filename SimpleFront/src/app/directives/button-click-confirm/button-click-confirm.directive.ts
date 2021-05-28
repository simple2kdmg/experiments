import { Directive, OnInit, OnDestroy,
         TemplateRef, ViewContainerRef,
         ComponentFactoryResolver, Input,
         ComponentFactory, ComponentRef} from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmButtonComponent } from './confirm-button.component';


@Directive({
  selector: '[clickConfirm]'
})
export class ButtonClickConfirmDirective implements OnInit, OnDestroy {
  @Input() clickConfirm: Function;
  @Input() clickConfirmSecondsForCancel: number = 5;

  private factory: ComponentFactory<ConfirmButtonComponent>;
  private nativeButtonRef: HTMLButtonElement;
  private confirmButtonComponentRef: ComponentRef<ConfirmButtonComponent>;
  private confirmButtonInstance: ConfirmButtonComponent;
  private confirmSubscription: Subscription;
  private cancelSubscription: Subscription;

  constructor(private tRef: TemplateRef<HTMLButtonElement>,
              private vcRef: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver) {
    this.factory = this.componentFactoryResolver.resolveComponentFactory(ConfirmButtonComponent);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  ngOnInit(): void {
    this.nativeButtonRef = this.vcRef.createEmbeddedView(this.tRef).rootNodes[0];
    this.nativeButtonRef.addEventListener('click', this.onButtonClick, false);
    this.confirmButtonComponentRef = this.vcRef.createComponent<ConfirmButtonComponent>(this.factory);
    this.confirmButtonInstance = this.confirmButtonComponentRef.instance;
    this.confirmButtonInstance.secondsForCancel = this.clickConfirmSecondsForCancel;
    this.confirmSubscription = this.confirmButtonInstance.onConfirm.subscribe(() => this.showInitialButton(true));
    this.cancelSubscription = this.confirmButtonInstance.onCancel.subscribe(() => this.showInitialButton());
  }

  private onButtonClick(): void {
    this.nativeButtonRef.hidden = true;
    this.confirmButtonInstance.hidden = false;
    this.confirmButtonInstance.startCountdown();
  }

  private showInitialButton(confirmed?: boolean): void {
    this.nativeButtonRef.hidden = false;
    if (confirmed && this.clickConfirm) this.clickConfirm();
  }

  ngOnDestroy(): void {
    this.nativeButtonRef.removeEventListener('click', this.onButtonClick);
    this.confirmSubscription.unsubscribe();
    this.cancelSubscription.unsubscribe();
    this.confirmButtonComponentRef.destroy();
  }
}
