// http based services
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { store } from '../redux/store';
import { CategoriesModel } from '../models/categories-model';
import { ActionType } from '../redux/actionType';
import { apiBaseURL } from 'src/environments/environment';
import { authHeaders } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ShopCategoriesService {

    constructor(private http: HttpClient) { }

    // get all shop categories from data source
    private getAllCategoriesAsync(): Promise<CategoriesModel[]> {
        return this.http.get<CategoriesModel[]>(apiBaseURL + "/shop/categories", { headers: authHeaders.createHeader(store.getState().token) } ).toPromise();
    }

    // set shop categories in the store
    public async setShopCategories(): Promise<CategoriesModel[]> {
      try {
        const shopCategories = await this.getAllCategoriesAsync();
        store.dispatch({ type: ActionType.SetShopCategories, payload: { shopCategories } });
        return shopCategories;
      }
      catch(err) {
        return [];
      }
    }

}
