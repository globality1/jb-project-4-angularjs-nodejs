// http based services
import { Injectable } from '@angular/core';
import { ProductModel } from '../models/product-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { store } from '../redux/store';
import { ActionType } from '../redux/actionType';
import { apiBaseURL } from 'src/environments/environment';
import { authHeaders } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    constructor(private http: HttpClient) { }

    public async setShopProducts() {
        const products = await this.getAllProductsAsync();
        store.dispatch({ type: ActionType.GetProducts, payload: { products } });
        return products;
    }
    // gets all products from data source
    public getAllProductsAsync(): Promise<ProductModel[]> {
        return this.http.get<ProductModel[]>(apiBaseURL + "/products", { headers: authHeaders.createHeader(store.getState().token) } ).toPromise();
    }

    // get one specific product from data source
    public getOneProductAsync(id: number): Promise<ProductModel> {
        return this.http.get<ProductModel>(apiBaseURL + "/products/" + id, { headers: authHeaders.createHeader(store.getState().token) } ).toPromise();
    }
    
    // adding new product by populating FormData from
    public addProductAsync(product: ProductModel): Promise<ProductModel> {
        let productForm: FormData  = new FormData();
        productForm.append('productName', product.productName);
        productForm.append('productPrice', product.productPrice.toString());
        productForm.append('productCategoryId', product.productCategoryId.toString());
        productForm.append('productImage', product.productImage);
        return this.http.post<ProductModel>(apiBaseURL + "/products", productForm, {headers: authHeaders.createHeader(store.getState().token)}).toPromise();
    }

    // updating new product by populating FormData from
    public updateProductAsync(product: ProductModel): Promise<ProductModel> {
        let productForm: FormData  = new FormData();
        productForm.append('productId', product.id.toString());
        productForm.append('productName', product.productName);
        productForm.append('productPrice', product.productPrice.toString());
        productForm.append('productCategoryId', product.productCategoryId.toString());
        if(product.productImage) {
            productForm.append('productImage', product.productImage);
        }
        return this.http.put<ProductModel>(apiBaseURL + "/products/" + product.id, productForm, {headers: authHeaders.createHeader(store.getState().token)}).toPromise();
    }

}
