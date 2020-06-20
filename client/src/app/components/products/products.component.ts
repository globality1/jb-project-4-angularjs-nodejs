import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { store } from 'src/app/redux/store';
import { CategoriesModel } from 'src/app/models/categories-model';
import { ProductFiltersService } from 'src/app/services/product-filters.service';
import { ProductsService } from 'src/app/services/products.service';
import { ActionType } from 'src/app/redux/actionType';
import { ShopCategoriesService } from 'src/app/services/categories.service';

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

  constructor(private productFilters: ProductFiltersService, private myProductsService: ProductsService, private myShopCategories: ShopCategoriesService) { }

  async ngOnInit() {
    // connect to socket in this area
    store.getState().socket.connect();

    // for the filters
    this.categoryId = 0;

    // store subscribe for changes in store
    store.subscribe(() => {
      this.products = this.productsDisplay = store.getState().products;
    });

    // if products exist in store
    if (store.getState().products) {
      this.products = this.productsDisplay = store.getState().products;
      this.shopCategories = store.getState().shopCategories;
    }

    // if products doesn't exist in store
    if (!store.getState().products) {
      this.shopCategories = await this.myShopCategories.setShopCategories();
      this.products = this.productsDisplay = await this.myProductsService.setShopProducts();
    }
    // socket to update products and view on the products page
    store.getState().socket.on("update-from-server", (products: ProductModel[]) => {
      store.dispatch({ type: ActionType.GetProducts, payload: { products } });
    });
  }

  public filterProductsByCategory(id: number) {
    this.categoryId = id;
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
      this.productsDisplay = this.productFilters.filterBySearch(this.products, this.searchValue.toLowerCase());
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
    if (this.searchValue.length > 0 && this.categoryId === 0) {
      this.productsDisplay = this.productFilters.filterBySearch(this.products, this.searchValue.toLowerCase());
      return;
    }
    if (this.searchValue.length > 0 && this.categoryId > 0) {
      this.filterProductsByCategory(this.categoryId);
      return;
    }
    if (this.searchValue.length === 0 && this.categoryId > 0) {
      this.filterProductsByCategory(this.categoryId);
      return;
    }
    else if (this.searchValue.length === 0) {
      this.productsDisplay = this.products;
    }
  }


}


