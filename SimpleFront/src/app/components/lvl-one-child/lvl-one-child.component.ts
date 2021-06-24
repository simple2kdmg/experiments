import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnChanges, DoCheck, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { LvlOneChildDatum } from 'src/app/models/lvl-one-child-datum.model';
import { MultiselectData, multiselectData, multiselectData2 } from 'src/app/mock-data/multiselect-mock-data.model';
import { forkJoin, Observable, of, fromEvent } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { ChartEntry } from '../canvas-chart/core/chart-entry.model';
import { waterfallChartConfig, waterfallChartGroup } from 'src/app/mock-data/kpi-chart-mock-data.model';

class BaseClass {
  id: number = 5;
  name: string = 'test';
}

class TestClass extends BaseClass {
  newField: string = 'newField';
  constructor(init?: Partial<TestClass>) {
    super();
    Object.assign(this, init);
  }
}

@Component({
  selector: 'lvl-one-child',
  templateUrl: './lvl-one-child.component.html',
  styleUrls: ['./lvl-one-child.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LvlOneChildComponent implements OnChanges, OnInit, DoCheck, OnDestroy, AfterViewInit {
  @Input() set testValue(value: number) {
    if (!value) console.log('no value!');
    else console.log('some value');
  }
  public multiselectData: MultiselectData[] = multiselectData2;
  public selectedNodes: MultiselectData[] = [];

  private counter = 0;
  public someText: string = 'Initial text';

  private button: HTMLButtonElement;

  private chartEntry: ChartEntry;

  public waterfallChartConfig = waterfallChartConfig;
  public waterfallChartGroup = [waterfallChartGroup];

  @ViewChild('canvasChart') set chart(value: ElementRef) {
    if (!value) return;
    this.chartEntry = new ChartEntry(value.nativeElement);
  }

  @ViewChild('button') set buttonRef(value: ElementRef) {
    if (!value || this.button) return;
    this.button = value.nativeElement;
    fromEvent(this.button, 'click').subscribe(() => console.log('no change detection??'));
    this.button.addEventListener('click', this.onButtonClick);
  }

  public get initialize(): boolean {
    console.count('lvl-1-child component redrawn');
    return true;
  }

  constructor(private cdRef: ChangeDetectorRef) {
    //this.cdRef.detach();
    console.log(new TestClass());
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  ngOnChanges(): void {
    //console.count('lvl-one-child onChanges');
  }

  ngOnInit(): void {
    console.log(`Test value: ${this.testValue}`);
  }

  ngDoCheck(): void {
    console.count('lvl-one-child doCheck');
  }

  ngAfterViewInit(): void {
  }

  public onSegmentSelect(e): void {
    
  }

  public onButtonClick(): void {
    this.counter++;
    this.someText += ' ' + this.counter;
  }

  public onInput(event): void {
    console.log(event);
  }

  ngOnDestroy(): void {
    this.button.removeEventListener('click', this.onButtonClick);
  }
}
