import {AfterContentChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {OrderService} from "../../../../services/order/order.service";
import {User} from "../../../../models/user.model";
import {AuthService} from "../../../../services/auth/auth.service";
import {TokenStorage} from "../../../../services/auth/token.storage";
import {TranslateService} from "@ngx-translate/core";
import {UserService} from "../../../../services/user/user.service";
import {Order} from "../../../../models/order.model";
import {LoadingUtils} from "../../../../utils/loading/loading.utils";
import {MenuUtils} from "../../../../utils/menu/menu.utils";
import {ImageService} from "../../../../services/image.service";

@Component({
  selector: 'my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.less']
})
export class MyOrdersComponent implements OnInit, AfterContentChecked {
  private user: User;
  private orders: Map<string, Map<number, Array<Order>>> = new Map<string, Map<number, Array<Order>>>();
  private ordersUpdated: boolean = true;
  loading: boolean;
  private ordersValues: Array<Map<number, Array<Order>>>;
  private ordersKeys: Array<string>;
  private booksCount: number;

  constructor(private orderService: OrderService,
              private authService: AuthService,
              private tokenStorage: TokenStorage,
              private translate: TranslateService,
              private imageService: ImageService,
              private userService: UserService,
              private loadingUtils: LoadingUtils,
              private cdr: ChangeDetectorRef,
              private menuUtils: MenuUtils) {
  }

  ngOnInit() {
    this.userService.loggedInUserAsObservable.subscribe(user => this.user = user);
    this.orderService.userOrdersAsObservable.subscribe(orders => this.orders = orders);
    this.orderService.ordersUpdatedAsObservable.subscribe(ordersUpdated => this.ordersUpdated = ordersUpdated);
    if (this.authService.isLoggedIn() && !this.user) {
      this.userService.getUserByUserName(this.tokenStorage.getUserId())
        .subscribe((user) => {
          this.user = new User(user);
          this.getOrders();
        });
    }
    if (this.user && this.ordersUpdated) {
      this.getOrders();
    }
    if (this.orders)
    {
      this.createKeysAndValuesForTemplate();
      this.loading = false;
    }
  }

  private getOrders() {
    this.loading = true;
    this.loadingUtils.blockUI();
    this.orderService.getOrder(this.user.id)
      .subscribe((orders) => {
        if (!orders) {
          this.orders = new Map<string, Map<number, Array<Order>>>();
          this.loading = false;
          LoadingUtils.unblockUI();
          return;
        }
        this.orders = this.convertOrdersToMapByDateAndUniqueId(orders);
        this.booksCount = orders.books_count;
        this.ordersUpdated = false;
        this.orderService.ordersUpdated.next(false);
        this.orderService.userOrders.next(this.orders);
        this.createKeysAndValuesForTemplate();
        this.loading = false;
        LoadingUtils.unblockUI();
      })
  }



  private convertOrdersToMapByDateAndUniqueId(orders): Map<string, Map<number, Array<Order>>> {
    let ordersByDate = orders['orders'];
    let ordersMapByDate = new Map<string, Map<number, Array<Order>>>();

    for (let orderByDate in ordersByDate) {
      let ordersMapByUniqueId = new Map<number, Array<Order>>();
      if (ordersByDate.hasOwnProperty(orderByDate))
      {
        let ordersByUniqueId = ordersByDate[orderByDate];
        for (let orderByUniqueId in ordersByUniqueId) {
          if (ordersByUniqueId.hasOwnProperty(orderByUniqueId)){
            let processedOrders = this.createOrdersList(ordersByUniqueId[orderByUniqueId]);
            this.addTotalAmountToOrders(processedOrders);
            ordersMapByUniqueId.set(Number.parseInt(orderByUniqueId),
              processedOrders)
          }
        }
        ordersMapByDate.set(orderByDate, ordersMapByUniqueId);
      }
    }
    return this.sortMapByKeys(ordersMapByDate);
  }

  private createOrdersList(ordersByDate: any) : Array<Order> {
    return ordersByDate.map(order => this.toOrder(order))
  }

  private toOrder(order: any) {
    return new Order(order);
  }

  private addTotalAmountToOrders(processedOrders: Order[]) {
    let totalAmount = processedOrders.reduce((acc, order) => acc + order.amount * order.book.price, 0);
    processedOrders.forEach(order => order.totalAmount = totalAmount);
  }

  private sortMapByKeys(unsortedMap: Map<string, Map<number, Array<Order>>>): Map<any, Map<number, Array<Order>>>{
    return new Map(
      Array.from(unsortedMap).sort((a, b) => Date.parse(b[0]) - Date.parse(a[0]))
    );
  }

  private createKeysAndValuesForTemplate() {
    this.ordersKeys = Array.from(this.orders.keys());
    this.ordersValues = Array.from(this.orders.values());
  }

  private getOrderByDateValues(ordersByDate: Map<number, Array<Order>>) {
    return Array.from(ordersByDate.values());
  }

  ngAfterContentChecked(): void {
    this.menuUtils.makeMenuItemActive();
  }

  showUniqueId(orderArray: Array<Order>, i: number) {
    if (orderArray.length == 1)
    {
      return true;
    }
    if (i < 1) {
      return true;
    }
    else if (orderArray[i].uniqueId == orderArray[i -1].uniqueId) {
      return false;
    }
    return true;
  }
}
