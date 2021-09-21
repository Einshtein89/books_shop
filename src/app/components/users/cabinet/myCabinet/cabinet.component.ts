import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UserService} from "../../../../services/user/user.service";
import {TokenStorage} from "../../../../services/auth/token.storage";
import {User} from "../../../../models/user.model";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormCreateService} from "../../../../services/form.create.service";
import {TranslateService} from "@ngx-translate/core";
import {Location} from "@angular/common";
import {FileHolder} from "angular2-image-upload";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ImageService} from "../../../../services/image.service";
import {Router} from "@angular/router";
import * as  _ from "underscore"
import {UserUtils} from "../../../../utils/users/user.utils";

declare var $ : any;

@Component({
  selector: 'cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css']
})
export class CabinetComponent implements OnInit, AfterViewChecked {

  private user: User;
  loading: boolean;
  private statusCode: string;
  private errorList: any = [];

  private mainSectionForm: FormGroup;
  private firstName: FormControl;
  private lastName: FormControl;
  private email: FormControl;
  private phone: FormControl;
  private sex: FormControl;
  private photo: FormData = null;

  private changePasswordForm: FormGroup;
  private password: FormControl;
  private oldPassword: FormControl;
  private confirmPassword: FormControl;

  private sexArray: Array<string>;
  private editableFields: Map<string, boolean> = new Map<string, boolean>();
  private formFields: Map<any, any>;
  private imgSrc: string;

  constructor(private userService: UserService,
              private tokenStorage: TokenStorage,
              private formCreateService: FormCreateService,
              private location: Location,
              private translate: TranslateService,
              private cdr: ChangeDetectorRef,
              private imageService: ImageService,
              private router: Router,
              private userUtils: UserUtils) {
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  private getCurrentUser() {
    this.userService.loggedInUserAsObservable.subscribe(user => this.user = user);
    if (this.user) {
      this.prepareCabinetData();
      return;
    }
      this.loading = true;
      this.userService.getUserByUserName(this.tokenStorage.getUserId())
        .subscribe(
          data => {
            this.user = this.userService.extractSingleUser(data);
            this.prepareCabinetData();
          },
          errorCode =>  this.statusCode = errorCode,
          () => this.loading = false
        );
  }

  private prepareCabinetData() {
    this.populateTextMessages();
    this.createForms();
    this.imageService.getImage(this.user['_links'].photo.href).subscribe((res) => {
        this.imgSrc = 'data:image/jpg;base64,' + res.body;
      },
      (error) => {
        if (error.status === 404) {
          this.imgSrc = this.imageService.getImgSrc(this.user);
        }
      }
    );
  }

  private onSubmit(user: User) {
    if (!this.mainSectionForm.valid) {
      return false;
    }
    this.updateUser(user)
  }

  private onSubmitPasswordChange(value: any) {
    if (!this.mainSectionForm.valid) {
      return false;
    }
    this.changePassword(value);
  }

  private goToPrevPage() {
    this.mainSectionForm.reset();
    this.location.back();
  }

  private updateUser(user: User) {
    this.userService.updateUser(user, this.user["_links"].self.href)
      .subscribe(
        () => {
          this.userUtils.renderMessage(this.translate.instant('user.form.actions.user.created.1')
            + user.firstName
            + this.translate.instant('user.form.actions.user.updated.2')
          );
          if ((!this.photo || $('.img-ul-container').children().length == 0) && !this.user.photo) {
            return;
          }
          this.imageService.postImage(this.photo ?
            this.photo :
            this.imageService.convertByteArraytoFormData(this.user.photo.body, "image/jpg"))
            .subscribe(
              (res) => {
                this.imgSrc = this.imageService.getImgSrc(res);
                // this.photoUpload = res.photoUpload.body;
                this.errorList = [];
                // $('#imageUploader').css('display', 'none');
                // $('.img-ul-container').empty();
                setTimeout(function() {
                  window.location.reload();
                }.bind(this), 2000);
              },
              (error) => this.errorList.push(error.error)
            );
        },
        error => this.errorList.push(error.error)
      );
    return false;
  }

  private changePassword(value: any) {
    this.userService.changePassword(value.oldPassword, value.password, this.user.id)
      .subscribe(() => this.errorList = [],
        (error) => {
          this.errorList = [];
          this.errorList.push(error.error);
          this.errorList = this.userService.processErrors(this.errorList);
        }
        );
  }

  private createForms() {
    this.formFields = this.populateFieldsAndValidators();
    this.mainSectionForm = this.createForm(this.mainSectionForm, this.formFields,
      "mainSectionForm", null);
    this.changePasswordForm = this.createForm(this.changePasswordForm, this.formFields,
      "changePasswordForm", this.userUtils.MatchPassword);
  }

  private createForm(form: FormGroup, formFields: Map<any, any>, formName: string, formValidators: any) {
    form = new FormGroup({});
    Array.from(formFields.entries())
      .filter((entry) => _.isEqual(entry[0], _.findWhere(entry, {formName: formName})))
      .forEach((entry) => {
        this[entry[0]['name']] = this.formCreateService
          ._createFormControl(this.user, entry[0], entry[1]);
        form.setControl(entry[0]['name'], this[entry[0]['name']]);
        this.editableFields.set(entry[0]['name'], false);
      });
    form.setValidators(formValidators);
    return form;
  }

  private populateFieldsAndValidators() {
    let fieldsWithValidators = new Map();
    fieldsWithValidators.set({name: "firstName", defaultValue: '', formName: "mainSectionForm"}, [
      Validators.required,
      Validators.maxLength(50)
    ]);
    fieldsWithValidators.set({name: "lastName", defaultValue: '', formName: "mainSectionForm"}, [
      Validators.required,
      Validators.maxLength(50)
    ]);
    fieldsWithValidators.set({name: "email", defaultValue: '', formName: "mainSectionForm"}, [
      Validators.required,
      Validators.email
    ]);
    fieldsWithValidators.set({name: "password", defaultValue: '', formName: "mainSectionForm"}, null);
    fieldsWithValidators.set({name: "phone", defaultValue: '', formName: "mainSectionForm"}, [
      Validators.required,
      Validators.pattern('^(\\+?(\\d{1}|\\d{2}|\\d{3})[- ]?)?\\d{3}[- ]?\\d{3}[- ]?\\d{4}$')
    ]);
    fieldsWithValidators.set({name: "sex", defaultValue: this.userUtils.getDefaultSex(), formName: "mainSectionForm"}, Validators.required);
    fieldsWithValidators.set({name: "password", defaultValue: '', formName: "changePasswordForm"}, Validators.required);
    fieldsWithValidators.set({name: "oldPassword", defaultValue: '', formName: "changePasswordForm"}, Validators.required);
    fieldsWithValidators.set({name: "confirmPassword", defaultValue: '', formName: "changePasswordForm"}, Validators.required);
    return fieldsWithValidators;
  }

  private getUneditableSexValue(sex: string) {
    if (sex == "man") {
      return this.userUtils.getValue(this.translate.instant('user.form.actions.sex.man'));
    } else {
      return this.userUtils.getValue(this.translate.instant('user.form.actions.sex.woman'));
    }
  }


  private populateTextMessages() {
    this.sexArray = [this.translate.instant('user.form.actions.sex.man'),
      this.translate.instant('user.form.actions.sex.woman')];
  }

  private setFieldUneditable(name: string, errors: any) {
    if (!errors) {
      this.editableFields.set(name, false)
    }
  }

  private onUploadFinished(event: FileHolder) {
    this.photo = this.imageService.prepareMultipartRequest(event);
  }

  private getUserPhoto() {
    return this.imgSrc;
  }

  private getTranslationForChangePhotoButton() {
    return this.translate.instant('user.form.actions.photo.change.button.label');
  }

  private getTranslationForUpdatePhotoButton() {
    return this.translate.instant('user.form.actions.photo.upload.button.label');
  }

  ngAfterViewChecked(): void {
    this.populateTextMessages();
    this.cdr.detectChanges();
  }

  private onRemoved() {
    this.photo = null;
  }
}
