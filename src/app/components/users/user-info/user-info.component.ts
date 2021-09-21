import {AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../services/user/user.service";
import {User} from "../../../models/user.model";
import {AddEditEntityComponent} from "../add-edit-entity/add-edit-entity.component";
import {ComponentFactory} from "../../../component-factory/component-factory";
import {EditDeleteUserService} from "../../../services/user/edit.delete.user.service";
import {Location} from "@angular/common";
import {ImageService} from "../../../services/image.service";
import * as  _ from "underscore"

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit, AfterViewChecked {

  id: string;
  entity: User;
  entities: User[];
  updatedUser: User;
  imgSrc: any;
  @ViewChild('addEditEntity', {read: ViewContainerRef}) addEditContainerRef;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private cdr: ChangeDetectorRef,
              private editDeleteUserService: EditDeleteUserService,
              private router: Router,
              private location: Location,
              private imageService: ImageService) {
     route.params.subscribe(params => { this.id = params['userId']; });
  }

  ngOnInit() {
    this.userService.allUsersAsObservable.subscribe(users => this.entities = users);
    this.userService.changedUserAsObservable.subscribe(user => this.updatedUser = user);
    this.entity = _.find(this.entities, (entity) => entity.id == this.id);
    if (!this.entity) {
      this.entity = this.userService.getSearchResultUserById(this.id);
    }
    if (!this.entity) {
      this.userService.getUserById(this.id)
        .subscribe(data => {
          this.entity = data;
          this.getUserImage();
        });
    }
    if (this.entity) {
      this.getUserImage();
    }
  }

  editUser() {
    this.editDeleteUserService.showEditEntityForm(this.entity, this.addEditContainerRef,
      {_isEdit: true, _isModal: true});
    this.cdr.detectChanges();
  }

  removeUser() {
    this.editDeleteUserService.deleteUser(this);
  }

  getUserImageSrc() {
    return this.imgSrc;
  }


  ngAfterViewChecked(): void {
    this.editDeleteUserService.updateCurrentUser(this);
    this.cdr.detectChanges();
  }

  getUserImage() {
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

}
