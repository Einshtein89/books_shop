import { Component, OnInit } from '@angular/core';
declare var $ : any;

@Component({
  selector: 'cabinet-main',
  templateUrl: './cabinet-main.component.html',
  styleUrls: ['./cabinet-main.component.less']
})
export class CabinetMainComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  makeActive($event) {
    $(event.target).siblings().removeClass('active');
    $(event.target).addClass('active');
  }
}

