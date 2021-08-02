import {Component, Input, OnInit} from '@angular/core';
import {EntityList} from "../../users/entity-list/entity-list.component";
import {PaginationService} from "../../../services/pagination.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'sorting-entities',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.css']
})
export class SortingComponent implements OnInit {

  @Input() entityListComponent: any;
  @Input() sortOptions: Array<object>;

  constructor(public paginationService: PaginationService) {
  }

  ngOnInit() {}

  sortPage(value: any) {
    this.entityListComponent.loading = true;
    this.paginationService.sortBy = value;
    this.paginationService.getPageByNumber(0, this.entityListComponent.name, value)
      .subscribe(
        data => this.entityListComponent.populateEntities(data, true),
        errorCode =>  this.entityListComponent.statusCode = errorCode,
        () => this.entityListComponent.loading = false)
  }

  private getKey(option: string) {
    return option.substring(0, option.indexOf(';'));
  }

  private getValue(option: string) {
    return option.substring(option.indexOf(';') + 1, option.length);
  }
}
