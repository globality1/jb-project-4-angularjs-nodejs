// axios based services for the fun
import { Injectable } from '@angular/core';
import axios from "axios";
import { store } from '../redux/store';
import { CartModel } from '../models/cart-model';
import { ActionType } from '../redux/actionType';
import { ShoppingCartItemModel } from '../models/shopping-cart-item-model';

@Injectable({
    providedIn: 'root'
})
export class userShoppingCartService {

    constructor() { }

    // check if cart exist
    public async checkCartExisting(): Promise<boolean> {
        const cart = await this.getUserShoppingCart()
        if (cart) {
            store.dispatch({ type: ActionType.SetCart, payload: { cart } });
            return true;
        }
    }

    // get cart from data source (if no cart, the server will create new one)
    public getUserShoppingCart(): Promise<CartModel[]> {
        const headers = {
            authorization: "Bearer " + store.getState().token
        }
        const uuid = store.getState().user.uuid;
        return new Promise<CartModel[]>((resolve, reject) => {
            axios.get<CartModel[]>("http://localhost:3000/api/cart/information/" + uuid, { headers: headers })
                .then(response => resolve(response.data))
                .catch(err => reject(err));
        });
    }

    // gets all user shopping items
    public async getUserShoppingCartItems(): Promise<ShoppingCartItemModel[]> {
        let shoppingCartItems = await this.getUserShoppingCartItemsFromDataSource();
        // if no items, we will set it empty
        if(shoppingCartItems === undefined) {
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
    private getUserShoppingCartItemsFromDataSource(): Promise<ShoppingCartItemModel[]> {
        const headers = {
            authorization: "Bearer " + store.getState().token
        }
        const cartId = store.getState().cart.id;
        return new Promise<ShoppingCartItemModel[]>((resolve, reject) => {
            axios.get<ShoppingCartItemModel[]>("http://localhost:3000/api/cart/information/items/" + cartId, { headers: headers })
                .then(response => resolve(response.data))
                .catch(err => reject(err));
        })
    }
}
