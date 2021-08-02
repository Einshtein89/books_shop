import {PaginationService} from "../pagination.service";
import {ChangeDetectorRef, Injectable, OnInit, ViewContainerRef} from "@angular/core";
import {UserService} from "./user.service";
import {ComponentFactory} from "../../component-factory/component-factory";
import {AddEditEntityComponent} from "../../components/users/add-edit-entity/add-edit-entity.component";
import {User} from "../../models/user.model";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
declare var $ : any;
import * as  _ from "underscore"

@Injectable()
export class EditDeleteUserService implements OnInit {

  constructor(private userService: UserService,
              private paginationService: PaginationService,
              private componentFactory: ComponentFactory,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
  }

  showEditEntityForm (entity: User, editForm: ViewContainerRef, options: any) {
    const expComponent =  this.componentFactory.getComponent(AddEditEntityComponent, editForm);
    expComponent.instance._ref = expComponent;
    expComponent.instance.options = options;
    expComponent.instance._currentUser = entity;
  }

  updateCurrentUser(component: any){
    if (component.updatedUser && component.entity.id == component.updatedUser.id) {
      component.entity = component.updatedUser;
    }
  }

  deleteUser(self) {
    $.confirm({
      animation: 'top',
      closeAnimation: 'top',
      title: this.translate.instant('user.form.actions.delete.confirm.popup.title'),
      content: this.translate.instant('user.form.actions.delete.confirm.popup.content')
      + '<text class="userName">' + self.entity.firstName + '</text>' + '?',
      draggable: false,
      closeIcon: true,
      buttons: {
        confirm: {
          text: this.translate.instant('user.form.actions.delete.button'),
          btnClass: 'btn-danger',
          action: function () {
            self.userService.deleteUser(self.entity["_links"].self.href)
              .subscribe(
                () => {
                  if (self.id) {
                    const urlTree = self.router.parseUrl(self.router.url);
                    const urlWithoutParams = urlTree.root.children['primary'].segments
                      .filter(it => it.path !== self.id)
                      .map(it => it.path).join('/');
                    self.router.navigateByUrl(urlWithoutParams);
                    // self.location.back(); - works slower
                    return;
                  }
                  if (!self.entityListComponent) {
                    self.getPageAfterRemove(0);
                  } else {
                    let users = self.entityListComponent.entityList;
                    let lastUserOnPage = users.length === 1;
                    if (!lastUserOnPage) {
                      self.entityListComponent.page.totalElements -= 1;
                      self.entityListComponent.entityList =
                        _.reject(users, (entity: User) => entity.id == self.entity.id);
                    } else {
                      self.getPageAfterRemove(self.entityListComponent.page.number - 1);
                    }
                  }
                },
                error => self.errorList = error.error
              );
          }
        },
        cancel: {
          text: this.translate.instant('user.form.actions.cancel.button'),
          btnClass: 'btn-default',
          action: function () {
          }
        }
      }
    });
  }
}
