import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { store } from 'src/app/redux/store';
import { CategoriesModel } from 'src/app/models/categories-model';
import { ProductFiltersService } from 'src/app/services/filters-for-products';
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
  public productsDisplay: ProductModel[];
  public categoryId: number;

  constructor(private productFilters: ProductFiltersService) { }

  async ngOnInit() {
    // connect to socket in this area
    store.getState().socket.connect();
    // for the filters
    this.categoryId = 0;
    // store subscribe for changes in store
    store.subscribe(() => {
      this.products = this.productsDisplay = store.getState().products;
      this.shopCategories = store.getState().shopCategories;
    });

    this.shopCategories = store.getState().shopCategories;
    this.products = this.productsDisplay = store.getState().products;
    
    // socket to update products and view on the products page
    store.getState().socket.on("update-from-server", (products: ProductModel[]) => {
      store.dispatch({ type: ActionType.GetProducts, payload: { products } });
    });
  }

  public filterProductsByCategory(id: number) {
    this.categoryId = id;
    // check if id is 0 and there is input in the search field
    this.productsDisplay = this.productFilters.filterProducts(this.products, this.productsDisplay, this.categoryId, this.searchValue)
  }

  // function to filter by search input
  public filterProductsBySearch() {
    this.productsDisplay = this.productFilters.filterProducts(this.products, this.productsDisplay, this.categoryId, this.searchValue)
  }



}


