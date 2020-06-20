import { Injectable } from '@angular/core';
import { ProductModel } from '../models/product-model';

@Injectable({
  providedIn: 'root'
})
export class ProductFiltersService {

  constructor() { }

  // filter all products with given value from products array
  public filterBySearch(products: ProductModel[], value: string) {
    let newProductsDisplay: ProductModel[];
    newProductsDisplay = [];
    for (let p in products) {
      if (products[p].productName.toLowerCase().indexOf(value) != -1) {
        newProductsDisplay.push(products[p]);
      }
    }
    return newProductsDisplay;
  }

  // filters all products with given category from products array
  public filterByCategory(products: ProductModel[], id: number) {
    let newProductsToDisplay: ProductModel[];
    newProductsToDisplay = [];
    for (let i = 0; i < products.length; i++) {
      if (products[i].productCategoryId === id) {
        newProductsToDisplay.push(products[i]);
      }
    }
    return newProductsToDisplay;
  }
}
