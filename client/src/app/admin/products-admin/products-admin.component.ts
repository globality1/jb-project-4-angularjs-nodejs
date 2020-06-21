import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { store } from 'src/app/redux/store';
import { CategoriesModel } from 'src/app/models/categories-model';
import { ProductFiltersService } from 'src/app/services/filters-for-products';
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

  constructor(private productFilters: ProductFiltersService, private myProductsService: ProductsService, private myShopCategories: ShopCategoriesService) { }

  async ngOnInit() {

    // for the filters
    this.categoryId = 0;

    // connect to socket in this area
    store.getState().socket.connect();

    // and make products be based on socket if any update / new product event occurs - same for everyone
    store.subscribe(() => {
      if (store.getState().products) {
        this.products = this.productsDisplay = store.getState().products;
        this.shopCategories = store.getState().shopCategories
      }
    });

    // get shop products from store
    this.products = this.productsDisplay = store.getState().products;
    // get shop categories from store
    this.shopCategories = store.getState().shopCategories;

    // socket to update products and view on the products page
    store.getState().socket.on("update-from-server", (products: ProductModel[]) => {
      store.dispatch({ type: ActionType.GetProducts, payload: { products } });
      this.products = this.productsDisplay = products;
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


