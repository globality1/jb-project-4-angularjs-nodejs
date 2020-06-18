import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user-model';
import { store } from '../redux/store';
import { ActionType } from '../redux/actionType';
import { ProductModel } from '../models/product-model';
import axios from "axios";
import { ProductsService } from './products.service';
import { userShoppingCartService } from './user-shopping-cart';
import { ShopCategoriesService } from './categories.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private myProductsService: ProductsService, private myShoppingCart: userShoppingCartService, private myShopCategories: ShopCategoriesService) { }

    private authLogin(credentials): Promise<UserModel[]> {
        return this.http.post<UserModel[]>("http://localhost:3000/api/auth/login", credentials).toPromise();
    }

    // pass login data to the data source and pass it to store it in the app
    public async loginFlow(credential): Promise<boolean> {
        const user = await this.authLogin(credential);
        if (user) {
            return this.storeUserInfo(user);
        }
        else {
            return false;
        }
    }

    // store user information and get initial products
    private async storeUserInfo(user: UserModel[]): Promise<boolean> {
        if (user) {
            // store user
            store.dispatch({ type: ActionType.Login, payload: { user } });
            // get all products
            await this.myProductsService.getAllProductsAsync();
            // check existing cart and create new one in data source if none
            await this.myShoppingCart.checkCartExisting();
            // get and construct shop categories in redux
            await this.myShopCategories.setShopCategories()
            // if cart exist, move to shop area
            await this.myShoppingCart.getUserShoppingCartItems();
            return true;
        }
        else {
            return false
        }
    }

    // had some trouble converting this one to http for some reason so went with axios
    public async logout() {
        try {
            const response = await axios.post("http://localhost:3000/api/auth/logout");
            // check if response
            if (response) {
                store.getState().socket.disconnect();
                store.dispatch({ type: ActionType.Logout });
                return true;
            }
        }
        catch (err) {
            console.log(err.response ? err.response.data : err.message);
        }
    }

}
