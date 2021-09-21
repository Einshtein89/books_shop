import {Injectable} from "@angular/core";
import {AbstractControl} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
declare var $ : any;


@Injectable()
export class UserUtils {

  constructor(private translate: TranslateService){}

  public MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value;
    let confirmPassword = AC.get('confirmPassword').value;
    if(password != confirmPassword) {
      AC.get('confirmPassword').setErrors( {MatchPassword: true} )
    } else {
      return null
    }
  }

  public renderMessage(message) {
    $.confirm({
      animation: 'top',
      closeAnimation: 'top',
      title: this.translate.instant('user.form.actions.confirm.popup.title'),
      content: message,
      draggable: false,
      closeIcon: true,
      buttons: {
        ok: function () {
        },
      }
    });
  }

  public getDefaultSex(): string {
    return "";
  }

  public getKey(sex: string) {
    return sex.substring(0, sex.indexOf(';'));
  }

  public getValue(sex: string) {
    return sex.substring(sex.indexOf(';') + 1, sex.length);
  }
}
