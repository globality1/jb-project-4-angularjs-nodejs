import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { store } from 'src/app/redux/store';
import { ShoppingCartItemModel } from 'src/app/models/shopping-cart-item-model';
import { UserShoppingCartActionsService } from 'src/app/services/user-shopping-cart-ations';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartModel } from 'src/app/models/cart-model';
import { apiBaseURL } from 'src/environments/environment';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public cartProducts: ShoppingCartItemModel[];
  public error: string;
  public searchValue: string;
  public cartTotalAmount: number;
  public cart: CartModel;
  public apiBaseURL;

  @Input()
  public allowEdit?: boolean;

  @Output()
  public hideCart: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private myCartItemsService: UserShoppingCartActionsService, private myAuthService: AuthService, private myRouter: Router) { }

  async ngOnInit() {
    // subscribe for changes in store for price changes
    store.subscribe(() => {
      if (store.getState().cart) {
        this.cartTotalAmount = store.getState().cartTotalPrice;
        this.cartProducts = store.getState().cartItems;
        this.cart = store.getState().cart;
      }
    })
    this.cartProducts = store.getState().cartItems;
    // get shop categories from store
    this.cartTotalAmount = store.getState().cartTotalPrice;
    this.apiBaseURL = apiBaseURL;
  }

  // clean whole cart from it's products
  public async cleanCart() {
    try {
      await this.myCartItemsService.removeAllItemsFromCart(store.getState().cart.id)
    }
    catch (err) {
      // logs out client if jwt token has timed out
      if (err.status === 401) {
        this.myAuthService.logout();
        this.myRouter.navigateByUrl("/");
      }
      // otherwise say to contact admin for this problem
      this.error = "Please try again later";
    }
  }

  public async removeItemFromCart(productId: number) {
    try {
      // get user response from data source
      await this.myCartItemsService.removeItemFromCart(productId);
    }
    catch (err) {
      // logs out client if jwt token has timed out
      if (err.status === 401) {
        this.myAuthService.logout();
        this.myRouter.navigateByUrl("");
      }
      // otherwise say to contact admin for this problem
      this.error = "Please try again later";
    }
  }

  // search highlight function
  public highlightSearch(e) {
    this.searchValue = e.target.value;
  }

  // emits "true" to hide cart from user
  public hideCartFromUser() {
    this.hideCart.emit(true);
  }

}
