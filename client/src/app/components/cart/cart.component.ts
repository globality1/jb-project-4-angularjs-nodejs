import { Component, OnInit, Input } from '@angular/core';
import { store } from 'src/app/redux/store';
import { ShoppingCartItemModel } from 'src/app/models/shopping-cart-item-model';
import { userShoppingCartService } from 'src/app/services/user-shopping-cart';
import { ActionType } from 'src/app/redux/actionType';
import { UserShoppingCartItemsService } from 'src/app/services/user-shopping-cart-items';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public cartProducts: ShoppingCartItemModel[];
  public error: string;
  public searchValue: string;
  public cartTotalAmount?: number;

  @Input()
  public allowEdit?: boolean;

  constructor(private myCartService: userShoppingCartService, private myCartItemsService: UserShoppingCartItemsService, private myAuthService: AuthService, private myRouter: Router) { }

  async ngOnInit(): Promise<void> {
    // subscribe for changes in store for price changes
    store.subscribe(() => {
      this.cartTotalAmount = store.getState().cartTotalPrice;
      this.cartProducts = store.getState().cartItems;
    })
    this.cartTotalAmount = store.getState().cartTotalPrice;
    this.cartProducts = store.getState().cartItems;
  }

  // clean whole cart from it's products
  public async cleanCart() {
    try {
      const cleanCart = await this.myCartItemsService.removeAllItemsFromCart(store.getState().cart.id)
    }
    catch (err) {
      this.error = err;
      // logs out client if jwt token has timed out
      if (err.status === 401) {
        const response = await this.myAuthService.logout();
        // if logout successful, log redirect to home
        if (response) {
          setTimeout(() => this.myRouter.navigateByUrl("/home"), 300);
          return
        }
      }
    }
  }

  public async removeItemFromCart(id: number) {
    try {
      // get user response from data source
      const response = await this.myCartItemsService.removeItemFromCart(id);
    }
    catch (err) {
      // logs out client if jwt token has timed out
      if (err.status === 401) {
        const response = await this.myAuthService.logout();
        // if logout successful, log redirect to home
        if (response) {
          setTimeout(() => this.myRouter.navigateByUrl("/home"), 300);
          return
        }
      }
      this.error = "Please try again later";
    }
  }

  public highlightSearch(e) {
    this.searchValue = e.target.value;
  }

}
