import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";

@Injectable()
export class MenuUtils {

  constructor(private router: Router){}


  public makeMenuItemActive() {
    let $categoryElements = $('.ui.vertical.menu').children();
    if ($categoryElements.length > 0) {
      $categoryElements.each(function(num, element) {
        let href = $(element).attr('href');
        if (href && href.includes(this.router.url)) {
          $(element).siblings().removeClass('active');
          $(element).addClass('active');
        }
      }.bind(this))
    }
  }
}
