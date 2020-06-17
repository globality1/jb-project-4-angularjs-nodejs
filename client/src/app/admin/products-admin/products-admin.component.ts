import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { store } from 'src/app/redux/store';
import { CategoriesModel } from 'src/app/models/categories-model';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.css']
})
export class ProductsComponentAdmin implements OnInit {

  public products: ProductModel[];
  public shopCategories: CategoriesModel[];
  public searchValue: string;

  constructor() { }

  ngOnInit() {
    // subscribe for store changes
    store.subscribe(() => {
      this.products = store.getState().products;
      this.shopCategories = store.getState().shopCategories;
    })
    // get products from store on init
    this.products = store.getState().products;
    this.shopCategories = store.getState().shopCategories;
  }
  
  // function to filter by category
  public filterProductsByCategory(id?: number) {
    let newProductsDisplay: ProductModel[];
    if (!id) {
      newProductsDisplay = [];
      this.products = store.getState().products;
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].productCategoryId === id) {
          newProductsDisplay.push(this.products[i]);
        }
      }
      this.products = newProductsDisplay;
      this.searchValue = "";
      return;
    }
    else {
      this.products = store.getState().products;
      this.searchValue = "";
      return;
    }
  }

  // function to filter by search value
  public filterProductsBySearch() {
    let newProductsDisplay: ProductModel[];
    console.log(this.searchValue);
    if (this.searchValue.length > 0) {
      newProductsDisplay = [];
      this.products = this.products;
      this.searchValue = this.searchValue.toLowerCase();
      for (let i = 0; i < this.products.length; i++) {
        for(let p in this.products) {
          if (this.products[p].productName.toLowerCase().indexOf(this.searchValue) != -1) {
            newProductsDisplay.push(this.products[p]);
          }
        }
        this.products = newProductsDisplay;
        return;
      }
    }
    this.products = store.getState().products;
    return;
  }
}


