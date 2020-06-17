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
        // get user info from session storage named user
        this.user = JSON.parse(sessionStorage.getItem("user"));
        this.cart = JSON.parse(sessionStorage.getItem("cart"));
        this.orderItems = [];
        if(JSON.parse(sessionStorage.getItem("orderItems"))){
        this.orderItems = JSON.parse(sessionStorage.getItem("orderItems"));
        }
        this.isLoggedIn = this.user !== null;
        this.socket = io.connect("http://localhost:3000");
        if (this.user) {
            // set isAdmin 
            this.isAdmin = this.user.isAdmin;
            // set token for jwt verification
            this.token = this.user.token;
            // get products info from session storage named
            this.products = JSON.parse(sessionStorage.getItem("products"));
            // get cartItems
            this.cartItems = JSON.parse(sessionStorage.getItem("cartItems"));
            if(this.cartItems === undefined) {
                this.cartItems = [];
            }
            // get cart total price
            this.cartTotalPrice = JSON.parse(sessionStorage.getItem("cartTotalPrice"));  
            // get categories for the shop
            this.shopCategories = JSON.parse(sessionStorage.getItem("shopCategories"));       
        } else {
            // clean all values
            this.isAdmin = 0;
            this.token = '';
            this.products = [];
            this.cart = {};
            this.cartItems = [];
            this.cartTotalPrice = 0;
            this.shopCategories = [];
            this.orderItems = []
        }
        
    }
}
