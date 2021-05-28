import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';

@Component({
  selector: 'lvl-one-child-content',
  templateUrl: './lvl-one-child-content.component.html',
  styleUrls: ['./lvl-one-child-content.component.scss']
})
export class LvlOneChildContentComponent implements OnInit, AfterViewInit, AfterContentInit {

  constructor() { }

  ngOnInit(): void {
    console.log('lvl-one-child-content INIT');
  }

  ngAfterViewInit(): void {
    console.log('lvl-one-child-content VIEW INIT');
  }

  ngAfterContentInit(): void {
    console.log('lvl-one-child-content CONTENT INIT');
  }

}
