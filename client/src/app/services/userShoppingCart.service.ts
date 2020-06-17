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

    public async checkCartExisting(): Promise<boolean> {
        const cart = await this.getUserShoppingCart()
        if (cart) {
            store.dispatch({ type: ActionType.SetCart, payload: { cart } });
            return true;
        }
    }


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


    public async getUserShoppingCartItems(): Promise<ShoppingCartItemModel[]> {
        let shoppingCartItems = await this.getUserShoppingCartItemsFromDataSource();
        if(shoppingCartItems === undefined) {
            shoppingCartItems = [];
        }
        if (shoppingCartItems) {
            store.dispatch({ type: ActionType.SetCartItems, payload: { cartItems: shoppingCartItems } });
            let cartTotalPrice = 0;
            for (let i = 0; i < shoppingCartItems.length; i++) {
                cartTotalPrice = cartTotalPrice + shoppingCartItems[i].totalPrice;
            }
            store.dispatch({ type: ActionType.SetNewCartTotalPrice, payload: { cartTotalPrice: cartTotalPrice } });
        }
        return shoppingCartItems;
    }

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
