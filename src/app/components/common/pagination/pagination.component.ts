import {AfterContentInit, AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../../services/user/user.service";
import {EntityList} from "../../users/entity-list/entity-list.component";
import {User} from "../../../models/user.model";
import {Router} from "@angular/router";
import {PaginationService} from "../../../services/pagination.service";
import {BooksList} from "../../books/books-list/books-list.component";
import {LoadingUtils} from "../../../utils/loading/loading.utils";

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, AfterViewChecked {

  // entityList: User[] = [];
  // loading: boolean;
  // statusCode: number;
  // user: User;
  // @Input() links: any;

  @Input() entityListComponent: any;
  @Input() isSpecialLinkForPageByNumber: boolean;
  // _currentPath: string;
  private pageArray: any[];

  constructor(private userService: UserService,
              private paginationService: PaginationService,
              private loadingUtils: LoadingUtils,
              private cdr: ChangeDetectorRef) {
    // this.paginationService.currentPageSize = 10;
  }

  ngOnInit() {}

  getFirstPage() {
    this._getPage("first");
  }

  getLastPage() {
    this._getPage("last");
  }

  getNextPage() {
    this._getPage("next");
  }

  getPreviousPage() {
    this._getPage("prev");
  }

  getPage(pageNumber: number, name: string) {
    this.entityListComponent.loading = true;
    this.loadingUtils.blockUI();
    if (this.entityListComponent.page.totalPages == 1) {
      return;
    }
    this.paginationService.getPageByNumber(pageNumber, name, this.paginationService.sortBy,
      this.createLinkForPageByNumber(pageNumber))
      .subscribe(
        data => this.entityListComponent.populateEntities(data, true),
        errorCode =>  this.entityListComponent.statusCode = errorCode,
        () => {
          this.entityListComponent.loading = false;
          LoadingUtils.unblockUI();
        }
      );
  }

  private _getPage(pageName: string) {
    this.entityListComponent.loading = true;
    this.loadingUtils.blockUI();
    this.paginationService.getPageByLink(this.entityListComponent.links[pageName].href)
      .subscribe(
        data => this.entityListComponent.populateEntities(data, true),
        errorCode => this.entityListComponent.statusCode = errorCode,
        () => {
          this.entityListComponent.loading = false;
          LoadingUtils.unblockUI();
        }
      );
  }

  private createLinkForPageByNumber(pageNumber: number) {
    if (this.isSpecialLinkForPageByNumber && this.entityListComponent.links.first) {
      return this.entityListComponent.links.first.href.replace('&page=0', `&page=${pageNumber}`)
    }
  }

  ngAfterViewChecked(): void {
    if (this.entityListComponent.page) {
      this.pageArray = Array.from(Array(this.entityListComponent.page.totalPages).keys());
    }
    this.cdr.detectChanges();
  }
}
