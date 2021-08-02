import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EntityList} from "../components/users/entity-list/entity-list.component";
import {MainPageComponent} from "../components/main-page/main-page.component";
import {StoreMainComponent} from "../components/store/store-main/store-main.component";
import {MainViewComponent} from "../components/main-view/main-view.component";
import {AdminGuard} from "../services/auth/admin-guard.service";
import {LoginComponent} from "../components/login/login.component";
import {LogoutComponent} from "../components/logout/logout.component";
import {UserInfoComponent} from "../components/users/user-info/user-info.component";
import {RegisterComponent} from "../components/users/register/register.component";
import {CabinetComponent} from "../components/users/cabinet/myCabinet/cabinet.component";
import {UserGuard} from "../services/auth/user-guard.service";
import {CabinetMainComponent} from "../components/users/cabinet/cabinet-main/cabinet-main.component";
import {MyOrdersComponent} from "../components/users/cabinet/myOrders/my-orders.component";
import {StoreBookListComponent} from "../components/store/store-book-list/store-book-list.component";
import {CartComponent} from "../components/store/cart/cart.component";
import {CartOrderComponent} from "../components/store/cart/cart-order/cart-order.component";
import {CartAuthorizationComponent} from "../components/store/cart/cart-authorization/cart-authorization.component";
import {CartConfirmationComponent} from "../components/store/cart/cart-confirmation/cart-confirmation.component";
import {OrderSuccessfullComponent} from "../components/store/cart/order-successfull/order-successfull.component";

export const cabinetRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: CabinetComponent, pathMatch: 'full'},
  { path: 'orders', component: MyOrdersComponent, pathMatch: 'full'}
];

export const storeRoutes: Routes = [
  { path: '', redirectTo: 'all', pathMatch: 'full'},
  { path: 'all', component: StoreBookListComponent, pathMatch: 'full'},
  { path: ':category', component: StoreBookListComponent, pathMatch: 'full'}
];

export const cartRoutes: Routes = [
  { path: '', redirectTo: 'check', pathMatch: 'full'},
  { path: 'check', component: CartOrderComponent, pathMatch: 'full'},
  { path: 'authorization', component: CartAuthorizationComponent, pathMatch: 'full'},
  { path: 'confirmation', component: CartConfirmationComponent, canActivate: [UserGuard] },
  { path: 'successfull', component: OrderSuccessfullComponent, canActivate: [UserGuard] }
];

export const mainRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: MainPageComponent, pathMatch: 'full'},
  { path: 'store', component: StoreMainComponent, children: storeRoutes },
  { path: 'cart', component: CartComponent, children: cartRoutes},
  { path: 'myCabinet', component: CabinetMainComponent, canActivate: [UserGuard], children: cabinetRoutes },
  { path: 'allUsers', component: EntityList, canActivate: [AdminGuard] },
  { path: 'allUsers/:userId', component: UserInfoComponent, canActivate: [UserGuard] },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'logout', component: LogoutComponent, pathMatch: 'full' }
];

const routes: Routes = [
  // { path: '', redirectTo: '/main/home', pathMatch: 'full' },
  { path: 'store', redirectTo: './store', pathMatch: 'full' },
  { path: '', component: MainViewComponent, children: mainRoutes }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
