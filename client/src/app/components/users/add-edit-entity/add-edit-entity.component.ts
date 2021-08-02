import {AfterViewChecked, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, AbstractControl} from "@angular/forms";
import {UserService} from "../../../services/user/user.service";
import {User} from "../../../models/user.model";
import {PaginationService} from "../../../services/pagination.service";
import {EntityList} from "../entity-list/entity-list.component";
import {Location} from "@angular/common";
import {FormCreateService} from "../../../services/form.create.service";
import {TranslateService} from "@ngx-translate/core";
import {ImageService} from "../../../services/image.service";
import {UserUtils} from "../../../utils/users/user.utils";

declare var $ : any;

@Component({
  selector: 'add-entity',
  templateUrl: './add-edit-entity.component.html',
  styleUrls: ['./add-edit-entity.component.less']
})
export class AddEditEntityComponent implements OnInit, OnDestroy, AfterViewChecked {
  public myForm: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  email: FormControl;
  password: FormControl;
  phone: FormControl;
  sex: FormControl;
  confirmPassword: FormControl;
  userList: User[];
  errorList: any = [];
  private _ref:any;
  _currentUser: User;
  private _links: any;
  private _entityListComponent: EntityList;
  private _isRegister: boolean;
  private options: any;
  private isFirstNameRequired: boolean = true;
  sexArray: Array<string>;
  _isModal: boolean;
  _isEdit: any;

  constructor(private userService: UserService,
              private paginationService: PaginationService,
              private location: Location,
              private formCreateService: FormCreateService,
              private translate: TranslateService,
              private cdr: ChangeDetectorRef,
              private imageService: ImageService,
              private userUtils: UserUtils) {
  }


  ngOnInit(): void {
    this._isRegister = this.options._isRegister || false;
    this._isModal = this.options._isModal || false;
    this._isEdit = this.options._isEdit || false;
    this.populateTextMessages();
    this.createForm();

    if (this._isModal) {
      $("#addEditUserModal").modal(/*{backdrop: "static"}*/);
    } else {
      $("#addEditUserModal").removeClass();
    }
  }

  ngOnDestroy() {
  }

  private createForm() {
    this.myForm = new FormGroup({});
    this.populateFieldsAndValidators().forEach((validators: any, fieldParameters: any) => {
      this[fieldParameters['name']] = this.formCreateService
        ._createFormControl(this._currentUser, fieldParameters, validators);
      this.myForm.setControl(fieldParameters['name'], this[fieldParameters['name']]);
    });
    this.myForm.setValidators(this.populateFormValidators());
  }

  private populateFieldsAndValidators() {
    let fieldsWithValidators = new Map();
    fieldsWithValidators.set({name: "firstName", defaultValue: ''}, [
      Validators.required,
      Validators.maxLength(50)
    ]);
    fieldsWithValidators.set({name: "lastName", defaultValue: ''}, [
      Validators.required,
      Validators.maxLength(50)
    ]);
    fieldsWithValidators.set({name: "email", defaultValue: ''}, [
      Validators.required,
      Validators.email
    ]);
    fieldsWithValidators.set({name: "password", defaultValue: ''}, Validators.required);
    fieldsWithValidators.set({name: "confirmPassword", defaultValue: ''}, null);
    fieldsWithValidators.set({name: "phone", defaultValue: ''}, [
      Validators.required,
      Validators.pattern('^(\\+?(\\d{1}|\\d{2}|\\d{3})[- ]?)?\\d{3}[- ]?\\d{3}[- ]?\\d{4}$')
    ]);
    fieldsWithValidators.set({name: "sex", defaultValue: this.userUtils.getDefaultSex()}, Validators.required);
    return fieldsWithValidators;
  }

  private populateFormValidators() {
    return !this._isEdit ? this.userUtils.MatchPassword : null;
  }

  //field can be required by condition
  private isFieldRequired()  {
    return this.isFirstNameRequired ? Validators.required : null;
  }

  removeModal(){
    $("#addEditUserModal").modal('hide');
    this._ref.destroy();
    this.ngOnDestroy();
  }

  goToPrevPage() {
    this.myForm.reset();
    this.location.back();
  }

  onSubmit(user: User) {
    if (!this.myForm.valid) {
      return false;
    }
    if (this._currentUser) {
      this.updateUser(user)
    } else {
      this.createUser(user);
    }
  }

  private updateUser(user: User) {
    this.userService.updateUser(user, this._currentUser["_links"].self.href)
      .subscribe(
        () => {
          this.myForm.reset();
          this.removeModal();
          this.userUtils.renderMessage(this.translate.instant('user.form.actions.user.created.1')
            + user.firstName
            + this.translate.instant('user.form.actions.user.updated.2')
          );
          if (!this._currentUser.photo){
            return;
          }
          this.errorList = [];
          this.imageService.postImage(this.imageService.convertByteArraytoFormData(this._currentUser.photo.body,
            "image/jpg")).subscribe(
              (res) => {
                this.errorList = []
              },
              (error) => {
                this.errorList = [];
                this.errorList.push(error.error);
                this.errorList = this.userService.processErrors(this.errorList);
              }
          );
        },
        error => {
          this.errorList = [];
          this.errorList.push(error.error);
          this.errorList = this.userService.processErrors(this.errorList);
        }
      );
    return false;
  }

  private createUser(user: User) {
    this.userService.createUser(user, this._isRegister)
      .subscribe(
        () => {
          this.myForm.reset();
          this.userUtils.renderMessage(this.translate.instant('user.form.actions.user.created.1')
            + user.firstName
            + this.translate.instant('user.form.actions.user.created.2')
          );
          if (!this._isModal) {
            this.myForm.reset();
            this.location.back();
            return;
          }
          let usersOnLastPage = this._entityListComponent.page.totalElements % this._entityListComponent.page.size;
          if (this._entityListComponent.entityList.length / this._entityListComponent.page.size === 1
            && usersOnLastPage === 0)
          {
            this.paginationService.getPageByNumber(this._entityListComponent.page.totalPages, this._entityListComponent.name)
              .subscribe(
                data => this._populateEntities(data)
              );
          } else {
            this.paginationService.getPageByLink(this._links.last.href)
              .subscribe(
                data => this._populateEntities(data)
              );
          }
          this.removeModal();
          this.errorList = [];
        },
        error => {
          this.errorList = [];
          this.errorList.push(error.error);
          this.errorList = this.userService.processErrors(this.errorList);
        }
      );
    return false;
  }

  private _populateEntities(data: Object) {
    this._entityListComponent.entityList = this.userService.extractUsers(data);
    this._entityListComponent.links = this.userService.extractLinks(data);
    this._entityListComponent.page = this.userService.extractPage(data);
  }

  private populateTextMessages() {
    this.sexArray = [this.translate.instant('user.form.actions.sex.man'),
      this.translate.instant('user.form.actions.sex.woman')];
  }

  ngAfterViewChecked(): void {
    this.populateTextMessages();
    this.cdr.detectChanges();
  }
}
