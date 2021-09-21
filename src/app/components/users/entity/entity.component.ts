import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Input, OnDestroy,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {User} from "../../../models/user.model";
import {UserService} from "../../../services/user/user.service";
import {EntityList} from "../entity-list/entity-list.component";
import {PaginationService} from "../../../services/pagination.service";
import {EditDeleteUserService} from "../../../services/user/edit.delete.user.service";
import {ImageService} from "../../../services/image.service";
declare var $ : any;

@Component({
  selector: 'single-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() entity: User;
  @Input() editForm: ViewContainerRef;
  @Input() entityListComponent: any;
  @Input() isTabFormat: boolean;
  updatedUser: User;
  errorList: any;
  imgSrc: any;
  isShowButtons: any;

  constructor(private userService: UserService,
              private paginationService: PaginationService,
              private cdr : ChangeDetectorRef,
              private editDeleteUserService: EditDeleteUserService,
              private imageService: ImageService) {}

  ngOnInit() {
    this.userService.changedUserAsObservable.subscribe(user => this.updatedUser = user);
    this.imageService.getImage(this.entity['_links'].photo.href).subscribe((res) => {
        this.imgSrc = 'data:image/jpg;base64,' + res.body;
      },
      (error) => {
        if (error.status === 404) {
          this.imgSrc = this.imageService.getImgSrc(this.entity);
        }
      }
    );
  }

  ngOnDestroy() {
  }

  editUser() {
    this.editDeleteUserService.showEditEntityForm(this.entity, this.editForm, {_isEdit: true, _isModal: true});
    this.cdr.detectChanges();
  }

  removeUser() {
    this.editDeleteUserService.deleteUser(this);
  };


  getUserPhoto() {
    return this.imgSrc;
  }

  private getPageAfterRemove(pageNumber: number) {
    this.paginationService.getPageByNumber(pageNumber, this.entityListComponent.name)
      .subscribe(
        data => {
          this.entityListComponent.entityList = this.userService.extractUsers(data);
          this.entityListComponent.links = this.userService.extractLinks(data);
          this.entityListComponent.page = this.userService.extractPage(data);
        },
        () => error => this.errorList = error.error,
      )
  }

  private _removeUserFromUi() {
    let entityList = this.editForm["_view"].component.entityList;
    let userIndex = entityList.indexOf(this.entity);
    entityList.splice(userIndex, 1)
  }

  ngAfterViewChecked(): void {
    this.editDeleteUserService.updateCurrentUser(this);
    $('.special.cards .image').dimmer({
      on: 'hover'
    });

    this.cdr.detectChanges();
  }

  showButtons() {
    this.isShowButtons = true;
  }

  hideButtons() {
    this.isShowButtons = false;
  }
}
