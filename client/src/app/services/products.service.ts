// http based services
import { Injectable } from '@angular/core';
import { ProductModel } from '../models/product-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { store } from '../redux/store';
import { ActionType } from '../redux/actionType';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    constructor(private http: HttpClient) { }

    // gets all products from data source
    public async getAllProductsAsync(): Promise<ProductModel[]> {
        const headers = {
            authorization: "Bearer " + store.getState().token
        }
        const products = this.http.get<ProductModel[]>("http://localhost:3000/api/products", { headers: headers } ).toPromise();
        
        return products;
    }

    // get one specific product from data source
    public async getOneProductAsync(id: number): Promise<ProductModel> {
        const headers = {
            authorization: "Bearer " + store.getState().token
        }
        return this.http.get<ProductModel>("http://localhost:3000/api/products/" + id, { headers: headers } ).toPromise();
    }
    
    // adding new product by populating FormData from
    public async addProductAsync(product: ProductModel): Promise<ProductModel> {
        let productForm: FormData  = new FormData();
        productForm.append('productName', product.productName);
        productForm.append('productPrice', product.productPrice.toString());
        productForm.append('productCategoryId', product.productCategoryId.toString());
        productForm.append('productImage', product.productImage);
        return this.http.post<ProductModel>("http://localhost:3000/api/products", 
        productForm, 
              // patch for formdata in angular so the server will know to read the data
              {headers: new HttpHeaders().set('authorization', "Bearer " + store.getState().token)} 
            ).toPromise();
    }

    // updating new product by populating FormData from
    public async updateProductAsync(product: ProductModel): Promise<ProductModel> {
        let productForm: FormData  = new FormData();
        productForm.append('productId', product.id.toString());
        productForm.append('productName', product.productName);
        productForm.append('productPrice', product.productPrice.toString());
        productForm.append('productCategoryId', product.productCategoryId.toString());
        if(product.productImage) {
            productForm.append('productImage', product.productImage);
        }
        return this.http.put<ProductModel>("http://localhost:3000/api/products/" + product.id, 
        productForm, 
              // patch for formdata in angular so the server will know to read the data
              {headers: new HttpHeaders().set('authorization', "Bearer " + store.getState().token)} 
            ).toPromise();
    }

    // activates socket to pull products information live
    public activateSocket(): boolean {
        // send socket to server client have connected
        store.getState().socket.emit("update-from-app", 'Success');
        // get response back from server with all products info as first without making additional call to the server,
        // and make products be based on socket if any update / new product event occurs - same for everyone
        store.getState().socket.on("update-from-server", (products: ProductModel[]) => {
            // if products returned
            if (products) {
                store.dispatch({ type: ActionType.GetProducts, payload: { products } })
            }
            return products
        });
        return true;
    }

}
