import { Component, OnInit } from '@angular/core';
import {User} from "../../../../models/user.model";
import {UserService} from "../../../../services/user/user.service";

@Component({
  selector: 'search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.less']
})
export class SearchResultListComponent implements OnInit {

  _searchResults: User[];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.searchResults = this._searchResults;
  }

}
