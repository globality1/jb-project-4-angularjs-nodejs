import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { store } from 'src/app/redux/store';
import { UserShoppingCartItemsService } from 'src/app/services/user-shopping-cart-items';
import { ShoppingCartItemModel } from 'src/app/models/shopping-cart-item-model';
import { ActionType } from 'src/app/redux/actionType';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  public newCartItem = new ShoppingCartItemModel;
  public isAdmin: number;

  public constructor(private myShoppingCartActions: UserShoppingCartItemsService, private myAuthService: AuthService, private myRouter: Router) { };
  @Input()
  public productId: number;

  @Input()
  public imageSource: string;

  @Input()
  public productName: string;

  @Input()
  public productPrice: number;

  ngOnInit() {
    this.isAdmin = store.getState().isAdmin;
    this.newCartItem.quantity = 0;
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
}
