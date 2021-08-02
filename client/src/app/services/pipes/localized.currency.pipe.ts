import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizedCurrency',
  pure: false
})
export class LocalizedCurrencyPipe implements PipeTransform {

  constructor(private translateService: TranslateService) {
  }

  transform(value: any, pattern: string = 'USD'): any {
    const datePipe: CurrencyPipe = new CurrencyPipe(this.translateService.currentLang);
    return datePipe.transform(value, pattern);
  }
}
