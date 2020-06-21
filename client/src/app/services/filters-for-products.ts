import { Injectable } from '@angular/core';
import { ProductModel } from '../models/product-model';

@Injectable({
  providedIn: 'root'
})
export class ProductFiltersService {

  constructor() { }

    // ssort of balancer for the filtering functions
    public filterProducts(products: ProductModel[], productsToDisplay: ProductModel[], categoryId?: number, searchValue?: string) {
      if (searchValue && categoryId > 0) {
        // filter first all products under same category
        productsToDisplay = this.filterByCategory(products, categoryId);
        // filter in the search filtered products
        productsToDisplay = this.filterBySearch(productsToDisplay, searchValue.toLowerCase());
        return productsToDisplay;
      }
      if (searchValue && categoryId === 0) {
        productsToDisplay = this.filterBySearch(products, searchValue.toLowerCase());
        return productsToDisplay;
      }
      if (!searchValue && (categoryId === 0 || !categoryId)) {
        productsToDisplay = products;
        return productsToDisplay;
      }
      if (!searchValue && categoryId > 0) {
        productsToDisplay = this.filterByCategory(products, categoryId);
        return productsToDisplay;
      }
    }

  // filter all products with given value from products array
  private filterBySearch(products: ProductModel[], value: string) {
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
  private filterByCategory(products: ProductModel[], id: number) {
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
