import { Component, ChangeDetectionStrategy,
         ChangeDetectorRef, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { LvlOneChildDatum } from 'src/app/models/lvl-one-child-datum.model';


@Component({
  selector: 'root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent implements OnInit, DoCheck, AfterViewInit {

  public get initialize(): boolean {
    console.count('root component redrawn');
    return true;
  }

  constructor(private cdRef: ChangeDetectorRef) {
    
  }

  ngOnInit(): void {

  }

  ngDoCheck(): void {
    console.count('root doCheck');
  }

  ngAfterViewInit(): void {
    
  }
}
