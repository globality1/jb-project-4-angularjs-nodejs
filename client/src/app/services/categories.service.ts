// http based services
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { store } from '../redux/store';
import { CategoriesModel } from '../models/categories-model';
import { ActionType } from '../redux/actionType';

@Injectable({
    providedIn: 'root'
})
export class ShopCategoriesService {

    constructor(private http: HttpClient) { }

    public getAllCategoriesAsync(): Promise<CategoriesModel[]> {
        const headers = {
            authorization: "Bearer " + store.getState().token
        }
        return this.http.get<CategoriesModel[]>("http://localhost:3000/api/shop/categories", { headers: headers } ).toPromise();
    }


    public async setShopCategories(): Promise<boolean> {
      const categories = await this.getAllCategoriesAsync();
      if(categories){
        store.dispatch({ type: ActionType.SetShopCategories, payload: { shopCategories: categories } });
        return true;
      }
      return false;
    }

}
