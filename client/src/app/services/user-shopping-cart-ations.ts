// http client based services

import { Injectable } from '@angular/core';
import { ShoppingCartItemModel } from '../models/shopping-cart-item-model';
import { HttpClient } from '@angular/common/http';
import { store } from '../redux/store';
import { ActionType } from '../redux/actionType';
import { CartModel } from '../models/cart-model';
import { apiBaseURL } from 'src/environments/environment';
import { authHeaders } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserShoppingCartActionsService {

  constructor(private http: HttpClient) { }
  // a bit complicated mechanism, adding new item to cart store in following way:
  public async addItemToCart(itemToAdd: ShoppingCartItemModel): Promise<boolean> {
    try {
      //add new item to cart in data source
      const addedItem = await this.itemToAdd(itemToAdd);
      // if item added
      if (addedItem) {
        // get cart items from redux store
        let cartItems = store.getState().cartItems;
        // get cart total price from redux store
        let cartTotalPrice = +store.getState().cartTotalPrice;
        // add to total price the total price of the new item
        cartTotalPrice = cartTotalPrice + addedItem.totalPrice;
        let itemExist = 0
        for (let i = 0; i < cartItems.length; i++) {
          console.log(cartItems[i])
          if (cartItems[i].productId === addedItem.productId) {
            cartItems[i].quantity = cartItems[i].quantity + addedItem.quantity;
            cartItems[i].totalPrice = cartItems[i].totalPrice + addedItem.totalPrice;
            itemExist++
          }
        }
        if(itemExist === 0) {
          cartItems.push(addedItem);
        }
        // // add new item to cart items
        // cartItems.push(addedItem);
        // write to store new total price
        store.dispatch({ type: ActionType.SetNewCartTotalPrice, payload: { cartTotalPrice } });
        // write to store new cart items
        store.dispatch({ type: ActionType.SetCartItems, payload: { cartItems } });
        return true;
      }
    }
    catch (err) {
      return false;
    }
  }

  // adding relevant item to the data source
  public itemToAdd(itemToAdd: ShoppingCartItemModel): Promise<ShoppingCartItemModel> {
    return this.http.post<ShoppingCartItemModel>(apiBaseURL + "/cart/actions/add", itemToAdd, { headers: authHeaders.createHeader(store.getState().token) }).toPromise();
  }

  // a bit complicated mechanism, takes id I want to remove from the cart and then does the following:
  public async removeItemFromCart(productId: number): Promise<boolean> {
    try {
      // remove id from the data source
      const removedItem = await this.itemToRemove(productId);
      // get cart items from redux store
      let cartItems: ShoppingCartItemModel[] = store.getState().cartItems;
      // find index of the item id we want to remove
      const index = cartItems.findIndex(c => c.productId == productId);
      // get cart total price from redux store
      let cartTotalPrice = +store.getState().cartTotalPrice;
      // reduce from total price the cost of the item we are removing
      cartTotalPrice = cartTotalPrice - cartItems[index].totalPrice;
      // remove the item from our cart items
      cartItems.splice(index, 1);
      // write to store new cart total price
      store.dispatch({ type: ActionType.SetNewCartTotalPrice, payload: { cartTotalPrice } });
      // write to store new cart items
      store.dispatch({ type: ActionType.SetCartItems, payload: { cartItems } });
      return true;
    }
    catch (err) {
      return false;
    }
  }

  // removes the relevant id from the data source
  public itemToRemove(productId: number): Promise<ShoppingCartItemModel[]> {
    return this.http.delete<ShoppingCartItemModel[]>(apiBaseURL + "/cart/actions/remove/" + productId, { headers: authHeaders.createHeader(store.getState().token) }).toPromise();
  }

  public async removeAllItemsFromCart(cartToEmpty: number): Promise<boolean> {
    try {
      // remove id from the data source
      await this.emptyCart(cartToEmpty);
      // get cart items from redux store
      let cartItems = [];
      // set cart total price = 0
      let cartTotalPrice = 0;
      // write to store new cart total price
      store.dispatch({ type: ActionType.SetNewCartTotalPrice, payload: { cartTotalPrice } });
      // write to store new cart items
      store.dispatch({ type: ActionType.SetCartItems, payload: { cartItems } });
      return true;
    }
    catch (err) {
      return false;
    }
  }

  // removes the relevant id from the data source
  public emptyCart(id: number): Promise<CartModel[]> {
    return this.http.delete<CartModel[]>(apiBaseURL + "/cart/actions/empty/" + id, { headers: authHeaders.createHeader(store.getState().token) }).toPromise();
  }

}
