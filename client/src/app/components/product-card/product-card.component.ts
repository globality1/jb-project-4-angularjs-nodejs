import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { store } from 'src/app/redux/store';
import { UserShoppingCartActionsService } from 'src/app/services/user-shopping-cart-ations';
import { ShoppingCartItemModel } from 'src/app/models/shopping-cart-item-model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  public newCartItem = new ShoppingCartItemModel;

  public constructor(private myShoppingCartActions: UserShoppingCartActionsService, private myAuthService: AuthService, private myRouter: Router) { };

  @Input()
  public productId: number;

  @Input()
  public imageSource: string;

  @Input()
  public productName: string;

  @Input()
  public productPrice: number;

  ngOnInit() {
    this.newCartItem.quantity = 0;
    this.newCartItem.cartId = store.getState().cart.id
    store.subscribe(() => {
      if (store.getState().cart)
        this.newCartItem.cartId = store.getState().cart.id
    });
  }

  public async addProductToCart() {
    try {
      // check and confirm that quantity is above 0 to not add negative price
      if (this.newCartItem.quantity <= 0) {
        this.newCartItem.quantity = 0;
        return;
      }
      // setting up the new cart item
      this.newCartItem.cartId = store.getState().cart.id;
      this.newCartItem.productId = +this.productId;
      this.newCartItem.totalPrice = this.newCartItem.quantity * this.productPrice;
      this.newCartItem.productName = this.productName;
      this.newCartItem.productImageName = this.imageSource;
      // get new item response from data source
      const response = await this.myShoppingCartActions.addItemToCart(this.newCartItem);
      // this.myAuthService.storeUserInfo(user);
      this.newCartItem = new ShoppingCartItemModel;
    }
    catch (err) {
      // logs out client if jwt token has timed out
      // logs out client if jwt token has timed out
      if (err.status === 401) {
        this.myAuthService.logout();
        this.myRouter.navigateByUrl("/home");
      }
    }
  }
}
