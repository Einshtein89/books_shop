import {
  AfterViewChecked,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ChangeDetectorRef, AfterViewInit
} from '@angular/core';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {User} from "../../../models/user.model";
import {UserService} from "../../../services/user/user.service";
import {AddEditEntityComponent} from "../add-edit-entity/add-edit-entity.component";
import * as  _ from "underscore"
import {ActivatedRoute, Router} from "@angular/router";
import {PaginationService} from "../../../services/pagination.service";
import {ComponentFactory} from "../../../component-factory/component-factory";
import {TranslateService} from "@ngx-translate/core";
import {LoadingUtils} from "../../../utils/loading/loading.utils";

@Component({
  selector: 'entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.less'],

})
export class EntityList implements OnInit, OnDestroy, AfterViewChecked {
  entityList: User[] = [];
  loading: boolean;
  statusCode: number;
  updatedUser: User;
  links: any;
  page: any;
  _page: string;
  name: string = 'user';
  isTabFormat: boolean = true;

  @ViewChild('addEditEntity', {read: ViewContainerRef}) addEditContainerRef;

  constructor(private userService: UserService,
              private paginationService: PaginationService,
              private cdr: ChangeDetectorRef,
              public router: Router,
              public route: ActivatedRoute,
              private componentFactory: ComponentFactory,
              private translate: TranslateService,
              private loadingUtils: LoadingUtils) {
    route.params.subscribe(params => { this._page = params['page']; });
  }


  showAddEntityForm () {
    const expComponent =  this.componentFactory.getComponent(AddEditEntityComponent, this.addEditContainerRef);
    expComponent.instance._ref = expComponent;
    expComponent.instance._links = this.links;
    expComponent.instance.options = {_isModal: true};
    expComponent.instance._entityListComponent = this;
  }

  ngOnInit() {
    this.paginationService.currentPageSize = this.paginationService.defaultPageSize;
    this.userService.changedUserAsObservable.subscribe(user => this.updatedUser = user);
    this.getAllUsers();
  }

  ngOnDestroy() {
    this.userService.entityList = this.entityList;
  }

  toggleView() {
    this.isTabFormat = !this.isTabFormat;
  }

  getAllUsers(): void {
    this.loadingUtils.blockUI();
    this.loading = true;
    this.userService.getAllUsers()
      .subscribe(
        data => {
          this.populateEntities(data)
          },
        errorCode =>  {
          this.statusCode = errorCode;
          LoadingUtils.unblockUI();
        },
        () => {
          this.loading = false;
          LoadingUtils.unblockUI();
        }
      );
  }

  populateEntities(data: Object) {
    this.entityList = this.userService.extractUsers(data);
    this.links = this.userService.extractLinks(data);
    this.page = this.userService.extractPage(data);
  }

  private getSortOptions() {
    return Object.values(this.translate.instant(['empty.property', 'all.users.page.sort.by.first.name.up',
      'all.users.page.sort.by.first.name.down']));
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }


}
