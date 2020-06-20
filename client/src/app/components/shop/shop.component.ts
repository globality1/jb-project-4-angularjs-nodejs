import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { store } from 'src/app/redux/store';
import { ActionType } from 'src/app/redux/actionType';
import { AuthService } from 'src/app/services/auth.service';
import { userShoppingCartService } from 'src/app/services/user-shopping-cart';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  public hideCart: boolean;
  public myDiv;
  public cartSize;
  public productsSize;

  constructor(private myRouter: Router, private el: ElementRef, private myAuthService: AuthService, private myCartService: userShoppingCartService) { }

  async ngOnInit(): Promise<void> {
    // check if user logged in, if no move him to login page
    if (!store.getState().isLoggedIn && store.getState().token) {
      const user = await this.myAuthService.reLogin(store.getState().token);
      if(user) {
          await this.myCartService.checkCartExisting();
          await this.myCartService.getUserShoppingCartItems();
          this.myRouter.navigateByUrl("/shop");
          return;
        }
    }
    if (!store.getState().isLoggedIn && !localStorage.getItem("token")) {
      this.myRouter.navigateByUrl("/home");
      return;
    }
    if (!store.getState().isLoggedIn && localStorage.getItem("token")) {
      this.myRouter.navigateByUrl("/shop");
      return;
    }
    if (store.getState().isLoggedIn) {
      await this.myCartService.checkCartExisting();
      await this.myCartService.getUserShoppingCartItems();
      return;
    }
    // remove orderItems from state so it will reset it self
    store.dispatch({ type: ActionType.SetOrderItems, payload: { orderItems: [] } })
    this.cartSize = "25%";
    this.productsSize = "75%";
  }

  public hideCartFromUser(value: boolean) {
    if(!this.myDiv) {
      this.myDiv = this.el.nativeElement.querySelectorAll("div")[1]
     }
    this.hideCart = value;
    this.myDiv.hidden = this.hideCart;
  }

}
