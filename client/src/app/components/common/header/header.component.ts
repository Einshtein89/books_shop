import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {TokenStorage} from "../../../services/auth/token.storage";
import {TranslateService} from "@ngx-translate/core";
import {CartService} from "../../../services/cart/cart.service";
import {ComponentFactory} from "../../../component-factory/component-factory";
import {AddToCartPopupComponent} from "../../store/cart/add-to-cart/add-to-cart-popup.component";
import {Book} from "../../../models/book.model";
import {Catalog} from "../../../models/catalog.model";
declare var $ : any;

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, AfterViewChecked {

  // private userRoles: string[];
  private languages: Map<string, string> = new Map<string, string>();
  private localeUpdated: boolean;
  cartLength: number;
  private displayEmptyCartPopup: boolean;
  expComponent: ComponentRef<any>;
  @ViewChild('emptyCartPopup', {read: ViewContainerRef}) emptyCartPopupContainerRef;


  constructor(public authService: AuthService,
              private router: Router,
              private tokenStorage: TokenStorage,
              public translate: TranslateService,
              private cartService: CartService,
              private componentFactory: ComponentFactory,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.cartService.booksInCartAsObservable.subscribe(
      booksMap => this.cartLength = Array.from(booksMap.values()).reduce((a, b) => a + b, 0));
    this.cartService.shouldDisplayEmptyCartPopupAsObservable.subscribe(
      displayEmptyCartPopup => this.displayEmptyCartPopup = displayEmptyCartPopup);
    // this.userRoles = this.tokenStorage.getUserRoles();
    this.languages.set('en', 'English');
    this.languages.set('ru', 'Russian');
    let langShortNames = Array.from(this.languages.keys());
    this.translate.addLangs(langShortNames);
    this.translate.setDefaultLang('en');
    if (!localStorage['language']) {
      localStorage['language'] = "en"
    }

    const browserLang = localStorage['language'] || "";
    this.translate.use(browserLang.match(/en|ru/) ? browserLang : 'en');


    // // let booksMap = this.cartService.booksInCart.getValue();
    // let map = new Map<Book, number>();
    // map.set(new Book({id: "1", author: "Test test", title: "New book", price: 300.45,
    //   catalog: new Catalog({id: "1", name: "Catalog"})}), 1)
    // this.cartService.booksInCart.next(map);

  }

  private logout() {
    this.tokenStorage.signOut();
    this.router.navigate(['.']);
  }

  showMenu() {
    $(".language_menu").addClass('visible');
  }

  hideMenu() {
    $(".language_menu").removeClass('visible');
  }

  private getFullName(lang: string) {
    return this.languages.get(lang);
  }

  private makeTranslation(lang: string) {
    this.translate.use(lang);
    localStorage['language'] = lang;
  }

  removeActiveFromCatalogList() {
    if ($("#categoryName").length != 0) {
      $('.ui.vertical.menu').children().removeClass('active')
    }
  }

  private showEmptyCartPopup () {
    this.cartService.showAddToCartPopup(null, AddToCartPopupComponent, this.emptyCartPopupContainerRef, null);
  }

  ngAfterViewChecked(): void {
    if (this.displayEmptyCartPopup) {
      this.showEmptyCartPopup();
      this.cartService.shouldDisplayEmptyCartPopup.next(false);
    }
    this.cdr.detectChanges();
  }
}
