import {TranslateService} from "@ngx-translate/core";
import {Injectable} from "@angular/core";

declare var $ : any;

@Injectable()
export class LoadingUtils {

  constructor(private translate: TranslateService){}

  public blockUI() {
    $.blockUI({
      message: '<div><span style="text-align: center">' +
        '<img src="assets/ajax-loader.gif"/><br></span>' + this.translate.instant('loading.message') + '</div>',
      showOverlay: true,
      baseZ: $.blockUI.defaults.baseZ,
      blockMsgClass: 'spinner'
    });
  }

  public static unblockUI() {
    $.unblockUI();
  }
}
