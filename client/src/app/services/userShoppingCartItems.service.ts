// http client based services

import { Injectable } from '@angular/core';
import { ShoppingCartItemModel } from '../models/shopping-cart-item-model';
import { HttpClient } from '@angular/common/http';
import { store } from '../redux/store';
import { ActionType } from '../redux/actionType';
import { CartModel } from '../models/cart-model';

@Injectable({
  providedIn: 'root'
})
export class UserShoppingCartItemsService {

  constructor(private http: HttpClient) { }
  // a bit complicated mechanism, adding new item to cart store in following way:
  public async addItemToCart(itemToAdd: ShoppingCartItemModel): Promise<void> {
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
        // add new item to cart items
        cartItems.push(addedItem);
        // write to store new total price
        store.dispatch({ type: ActionType.SetNewCartTotalPrice, payload: { cartTotalPrice } });
        // write to store new cart items
        store.dispatch({ type: ActionType.SetCartItems, payload: { cartItems } });
      }
    }
    catch (err) {
    }
  }

  // adding relevant item to the data source
  public itemToAdd(itemToAdd: ShoppingCartItemModel): Promise<ShoppingCartItemModel> {
    const headers = {
      authorization: "Bearer " + store.getState().token
    };
    return this.http.post<ShoppingCartItemModel>("http://localhost:3000/api/cart/actions", itemToAdd, { headers: headers }).toPromise();
  }

  // a bit complicated mechanism, takes id I want to remove from the cart and then does the following:
  public async removeItemFromCart(idToRemove: number): Promise<boolean> {
    try {
      // remove id from the data source
      const removedItem = await this.itemToRemove(idToRemove);
      // get cart items from redux store
      let cartItems: ShoppingCartItemModel[] = store.getState().cartItems;
      // find index of the item id we want to remove
      const index = cartItems.findIndex(c => c.id == idToRemove);
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
      return true
    }
    catch (err) {
      return false;
    }
  }

  // removes the relevant id from the data source
  public itemToRemove(id: number): Promise<ShoppingCartItemModel[]> {
    const headers = {
      authorization: "Bearer " + store.getState().token
    };
    return this.http.delete<ShoppingCartItemModel[]>("http://localhost:3000/api/cart/actions/" + id, { headers: headers }).toPromise();
  }

  public async removeAllItemsFromCart(cartToEmpty: number): Promise<boolean> {
    try {
      // remove id from the data source
      const emptiedCart = await this.emptyCart(cartToEmpty);
      // get cart items from redux store
      let cartItems = [];
      // set cart total price = 0
      let cartTotalPrice = 0;
      // write to store new cart total price
      store.dispatch({ type: ActionType.SetNewCartTotalPrice, payload: { cartTotalPrice } });
      // write to store new cart items
      store.dispatch({ type: ActionType.SetCartItems, payload: { cartItems } });
      return true
    }
    catch (err) {
      return err;
    }
  }

  // removes the relevant id from the data source
  public emptyCart(id: number): Promise<CartModel[]> {
    const headers = {
      authorization: "Bearer " + store.getState().token
    };
    return this.http.delete<CartModel[]>("http://localhost:3000/api/cart/actions/empty/" + id, { headers: headers }).toPromise();
  }

}
