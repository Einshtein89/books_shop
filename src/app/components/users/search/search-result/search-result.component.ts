import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../../../models/user.model";
import {UserService} from "../../../../services/user/user.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
declare var $ : any;

@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.less'],
  animations: [
    trigger('resultAppearance', [
      state('in', style({transform: 'translateY(0)'})),
      state('void', style({height: '0px'})),
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate(300)
      ])
    ])
  ]
})
export class SearchResultComponent implements OnInit, OnDestroy {

  @Input() searchResult: User;
  constructor(private userService: UserService) {}

  ngOnInit() {
    // this.userService.searchUser = this.searchResult;
  }

  ngOnDestroy(): void {
  }

  getToolTipText() : string {
    return "Click to see " + this.searchResult.firstName + "!";
  }

  removeFading() {
    $(".modal-backdrop").remove();
  }



}
