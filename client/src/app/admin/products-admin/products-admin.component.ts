import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { store } from 'src/app/redux/store';
import { CategoriesModel } from 'src/app/models/categories-model';
import { ProductFiltersService } from 'src/app/services/product-filters.service';
import { ActionType } from 'src/app/redux/actionType';
import { ProductsService } from 'src/app/services/products.service';
import { ShopCategoriesService } from 'src/app/services/categories.service';

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
  public categoryId: number;

  constructor( private productFilters: ProductFiltersService, private myProductsService: ProductsService, private myShopCategories: ShopCategoriesService ) { }

  async ngOnInit() {
    
    // for the filters
    this.categoryId = 0;

    // connect to socket in this area
    store.getState().socket.connect();

    // and make products be based on socket if any update / new product event occurs - same for everyone
    store.subscribe(() => {
      this.products = this.productsDisplay = store.getState().products;
    });

    if (store.getState().products.length !== 0) {
      // get products from store on init
      this.products = this.productsDisplay = store.getState().products;
      // get shop categories from store
      this.shopCategories = store.getState().shopCategories;
    }

    if (store.getState().products.length === 0) {
      this.shopCategories = await this.myShopCategories.setShopCategories();
      this.products = this.productsDisplay = await this.myProductsService.setShopProducts();
    }

    // socket to update products and view on the products page
    store.getState().socket.on("update-from-server", (products: ProductModel[]) => {
      store.dispatch({ type: ActionType.GetProducts, payload: { products } });
      this.products = this.productsDisplay = products;
    });
  }
  

  // filter products by category logic
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


