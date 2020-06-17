import { Component, OnInit, Input } from '@angular/core';
import { store } from 'src/app/redux/store';
import { ShoppingCartItemModel } from 'src/app/models/shopping-cart-item-model';
import { userShoppingCartService } from 'src/app/services/userShoppingCart.service';
import { ActionType } from 'src/app/redux/actionType';
import { UserShoppingCartItemsService } from 'src/app/services/userShoppingCartItems.service';
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
    if (store.getState().cartItems) {
      this.cartProducts = store.getState().cartItems;
    }
    else {
      this.cartProducts = await this.myCartService.getUserShoppingCartItems();
      store.dispatch({ type: ActionType.SetCartItems, payload: { cartItems: this.cartProducts } });
    }
  }

  public async cleanCart() {
    try {
      const cleanCart = await this.myCartItemsService.removeAllItemsFromCart(store.getState().cart.id)
    }
    catch (err) {
      this.error = err;
    }
  }

  public async removeItemFromCart(id: number) {
    try {
      // get user response from data source
      const response = await this.myCartItemsService.removeItemFromCart(id);
    }
    catch (err) {
      const response = await this.myAuthService.logout();
      if (response) {
        setTimeout(() => this.myRouter.navigateByUrl("/home"), 200);
        // store dispatch
        store.getState().socket.disconnect();
        store.dispatch({ type: ActionType.Logout });
      }
      this.error = "Please try again later";
    }
  }

  public moveToCheckOut() {
    this.myRouter.navigateByUrl("/shop/check-out")
  }

  public moveBackToShop() {
    this.myRouter.navigateByUrl("/shop")
  }

  public highlightSearch(e) {
    this.searchValue = e.target.value;
  }

}
