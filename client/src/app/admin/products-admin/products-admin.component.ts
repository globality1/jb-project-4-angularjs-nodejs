import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { store } from 'src/app/redux/store';
import { CategoriesModel } from 'src/app/models/categories-model';
import { ProductFiltersService } from 'src/app/services/product-filters.service';
import { ActionType } from 'src/app/redux/actionType';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.css']
})
export class ProductsComponentAdmin implements OnInit {

  public products: ProductModel[];
  public shopCategories: CategoriesModel[];
  public searchValue: string;
  public productsDisplay: ProductModel[];

  constructor( private productFilters: ProductFiltersService, private myProductsService: ProductsService ) { }

  ngOnInit() {
    store.getState().socket.connect();
    // subscribe for product changes
    // and make products be based on socket if any update / new product event occurs - same for everyone
    store.subscribe(() => {
      this.products = store.getState().products;
      this.productsDisplay = store.getState().products;
    });
    // activate socket pull
    this.myProductsService.activateSocket();
    this.products = store.getState().products;
    this.shopCategories = store.getState().shopCategories;
    this.productsDisplay = store.getState().products;
    // set initial display of all products as the default
  }
  
  // function to filter by category
  public filterProductsByCategory(id: number) {
    // check if id is 0 and there is input in the search field
    if (id === 0 && this.searchValue) {
      // filter search value
      this.filterProductsBySearch()
      return;
    }
    // check if id is 0 and no search value
    if (id === 0 && !this.searchValue) {
      // set display of all products
      this.productsDisplay = this.products;
      return;
    }
    // if id not 0, and search value exist
    if (this.searchValue && id > 0) {
      // filter all products by search value
      this.filterProductsBySearch();
      // filter in the search filtered products
      this.productsDisplay = this.productFilters.filterByCategory(this.productsDisplay, id);
      return;
    }
    // if id 0 and no input
    this.productsDisplay = this.productFilters.filterByCategory(this.products, id);
    return;
  }

  // function to filter by search input
  public filterProductsBySearch() {
    if (this.searchValue.length > 0) {
      this.productsDisplay = this.productFilters.filterBySearch(this.products, this.searchValue.toLowerCase())
    }
    else if (this.searchValue.length === 0) {
      this.productsDisplay = this.products;
    }
  }
}


