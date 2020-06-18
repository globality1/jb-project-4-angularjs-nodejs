import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { store } from 'src/app/redux/store';
import { CategoriesModel } from 'src/app/models/categories-model';
import { ProductFiltersService } from 'src/app/services/product-filters.service';
import { ProductsService } from 'src/app/services/products.service';
import { ActionType } from 'src/app/redux/actionType';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  // adding products param to save going to store each time and to have a solid object with all products
  public products: ProductModel[];
  public shopCategories: CategoriesModel[];
  public searchValue: string;
  public cartTotalPrice: number;
  public productsDisplay: ProductModel[];

  constructor(private productFilters: ProductFiltersService, private myProductsService: ProductsService) { }

  ngOnInit() {
    // connect to socket to receive update information
    store.getState().socket.connect();
    // subscribe for product changes
    // and make products be based on socket if any update / new product event occurs - same for everyone
    store.subscribe(() => {
      this.products = store.getState().products;
      this.productsDisplay = store.getState().products;
    });
    // get products from store on init
    this.myProductsService.activateSocket();
    // set products from store
    this.products = store.getState().products;
    this.shopCategories = store.getState().shopCategories;
    // set initial display of all products as the default
    this.productsDisplay = this.products;
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


