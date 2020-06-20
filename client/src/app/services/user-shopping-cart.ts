// axios based services for the fun
import { Injectable } from '@angular/core';
import axios from "axios";
import { store } from '../redux/store';
import { CartModel } from '../models/cart-model';
import { ActionType } from '../redux/actionType';
import { ShoppingCartItemModel } from '../models/shopping-cart-item-model';
import { apiBaseURL } from 'src/environments/environment';
import { authHeaders } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class userShoppingCartService {

    constructor() { }

    // check if cart exist
    public async checkCartExisting(): Promise<CartModel[]> {
        const cart = await this.getUserShoppingCart();
        if (cart) {
            store.dispatch({ type: ActionType.SetCart, payload: { cart } });
            return cart;
        }
    }

    // get cart from data source (if no cart, the server will create new one)
    public async getUserShoppingCart(): Promise<CartModel[]> {
        const uuid = store.getState().user.uuid;
        return new Promise<CartModel[]>((resolve, reject) => {
            axios.get<CartModel[]>(apiBaseURL + "/cart/information/" + uuid, { headers: authHeaders.createHeader(store.getState().token)})
                .then(response => resolve(response.data))
                .catch(err => reject(err));
        });
    }

    // gets all user shopping items
    public async getUserShoppingCartItems(): Promise<ShoppingCartItemModel[]> {
        let shoppingCartItems = await this.getUserShoppingCartItemsFromDataSource();
        // if no items, we will set it empty
        if (shoppingCartItems === undefined) {
            shoppingCartItems = [];
        }
        if (shoppingCartItems) {
            // set cart in store
            store.dispatch({ type: ActionType.SetCartItems, payload: { cartItems: shoppingCartItems } });
            // calculates the total value of the cart items
            let cartTotalPrice = 0;
            for (let i = 0; i < shoppingCartItems.length; i++) {
                cartTotalPrice = cartTotalPrice + shoppingCartItems[i].totalPrice;
            }
            // set cart total price in the store
            store.dispatch({ type: ActionType.SetNewCartTotalPrice, payload: { cartTotalPrice: cartTotalPrice } });
        }
        return shoppingCartItems;
    }

    // get all user shopping cart items from the data source
    private async getUserShoppingCartItemsFromDataSource(): Promise<ShoppingCartItemModel[]> {
        const cartId = store.getState().cart.id;
        return new Promise<ShoppingCartItemModel[]>((resolve, reject) => {
            axios.get<ShoppingCartItemModel[]>(apiBaseURL + "/cart/information/items/" + cartId, { headers: authHeaders.createHeader(store.getState().token) })
                .then(response => resolve(response.data))
                .catch(err => reject(err));
        })
    }
}
