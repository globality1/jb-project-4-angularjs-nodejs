import { UserModel } from "../models/user-model";
import { ProductModel } from "../models/product-model";
import * as io from "socket.io-client";
import { CartModel } from '../models/cart-model';
import { ShoppingCartItemModel } from '../models/shopping-cart-item-model';
import { CategoriesModel } from '../models/categories-model';

export class AppState {
    public isLoggedIn: boolean;
    public user: UserModel;
    public isAdmin: number;
    public token: string;
    public cart: CartModel;
    public cartItems: ShoppingCartItemModel[];
    public cartTotalPrice: number;
    public products: ProductModel[];
    public socket: SocketIOClient.Socket;
    public shopCategories: CategoriesModel[];
    public orderItems: ShoppingCartItemModel[];

    public constructor() {
        this.socket = io.connect("http://localhost:3000");
        this.user;
        this.isLoggedIn;;
        this.isAdmin;;
        this.products;
        this.cart;
        this.cartItems;
        this.orderItems;
        this.cartTotalPrice;
        if(localStorage.getItem("token")){
            this.token = localStorage.getItem("token").replace(/"/gi, "");
        }
        this.orderItems;
    }
}
