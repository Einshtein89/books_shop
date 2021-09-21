import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {User} from "../../../models/user.model";
import {EditDeleteUserService} from "../../../services/user/edit.delete.user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('addEditEntity', {read: ViewContainerRef}) addEditContainerRef;
  entity: User;
  constructor(private editDeleteUserService: EditDeleteUserService) { }

  ngOnInit() {
    this.editDeleteUserService.showEditEntityForm(this.entity, this.addEditContainerRef,
      {_isEdit: false, _isRegister: true, isModal: false});
  }
}
