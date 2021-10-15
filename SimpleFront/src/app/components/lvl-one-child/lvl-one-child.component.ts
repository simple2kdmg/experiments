import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnChanges, DoCheck, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { LvlOneChildDatum } from 'src/app/models/lvl-one-child-datum.model';
import { MultiselectData, multiselectData, multiselectData2 } from 'src/app/mock-data/multiselect-mock-data.model';
import { forkJoin, Observable, of, fromEvent } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import mockUsers from '../../mock-data/mock-users.json';
import { MUser } from 'src/app/mock-data/user.model';


@Component({
  selector: 'lvl-one-child',
  templateUrl: './lvl-one-child.component.html',
  styleUrls: ['./lvl-one-child.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LvlOneChildComponent implements OnChanges, OnInit, DoCheck, OnDestroy, AfterViewInit {
  public multiselectData: MultiselectData[] = multiselectData2;
  public selectedNodes: MultiselectData[] = [];
  public mUsers: MUser[];
  public templateVisible: boolean;

  public get initialize(): boolean {
    console.count('lvl-1-child component redrawn');
    return true;
  }

  constructor(private cdRef: ChangeDetectorRef) {

  }

  ngOnChanges(): void {
    //console.count('lvl-one-child onChanges');
  }

  ngOnInit(): void {
    this.mUsers = mockUsers.users;
    console.log(this.mUsers[0].fullName);
  }

  ngDoCheck(): void {
    console.count('lvl-one-child doCheck');
  }

  ngAfterViewInit(): void {
  }

  public onSegmentSelect(e): void {
    
  }

  public toggleTemplate(): void {
    this.templateVisible = !this.templateVisible;
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {

  }
}
