import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PaginationService} from "../../../../services/pagination.service";
import {Constants} from "../../../../constants/constants";

@Component({
  selector: 'entities-per-page',
  templateUrl: './entities-per-page.component.html',
  styleUrls: ['./entities-per-page.component.less'],
})
export class EntitiesPerPageComponent implements OnInit {

  @Input() entityListComponent: any;
  @Input() isSpecialLinkForPageByNumber: boolean;
  @Input() category: string;
  pageSizes: Array<number>;

  constructor(public paginationService: PaginationService) {
    this.pageSizes = [3,5,10,25,100];
  }

  ngOnInit() {}

  changePageSize(value: any) {
    this.entityListComponent.loading = true;
    let linkForPageByNumber = this.createLinkForPageBySize(value);
    this.paginationService.currentPageSize = value;
    this.paginationService.sortBy = "";
    this.paginationService.getPageByNumber(0, this.entityListComponent.name,
      this.paginationService.sortBy, linkForPageByNumber)
      .subscribe(
        data => this.entityListComponent.populateEntities(data, true),
        errorCode =>  this.entityListComponent.statusCode = errorCode,
        () => this.entityListComponent.loading = false)
  }

  private createLinkForPageBySize(pageSize: number) {
    if (this.isSpecialLinkForPageByNumber) {
      let link = this.entityListComponent.links.first;
      return link ?
        link.href.replace(`&size=${this.paginationService.currentPageSize}`, `&size=${pageSize}`) :
        this.defaultLinkForPageBySize(pageSize);
    }
  }

  private defaultLinkForPageBySize(pageSize: number) {
    return `${Constants.hostUrl}${Constants.books}${Constants.getBookByCatalogId}?${Constants.catalogId}${this.category}&page=0&size=${pageSize}`
  }
}
