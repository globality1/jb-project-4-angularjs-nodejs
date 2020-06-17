import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
import { CategoriesModel } from 'src/app/models/categories-model';
import { store } from 'src/app/redux/store';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})

export class AddProductComponent implements OnInit {

  public product = new ProductModel();
  public categories: CategoriesModel[];
  public previewImage: any = null;
  public error: string;

  constructor(private myProductsService: ProductsService, private myRouter: Router) { }

  ngOnInit(): void {
    this.categories = store.getState().shopCategories;
  }

  public async addProduct() {
    try {
      if (this.product.productPrice <= 0) {
        this.product.productPrice = 0;
        return;
      }

      if (this.product.productName.length < 2 || this.product.productCategoryId <= 0 || !this.product.productImage) {
        this.error = "Fields can't be empty"
        return;
      }
      this.error = '';

      if (this.product.productImage.size> 1000000) {
        this.error = "Max File size is 1 mb"
      }
      this.error = '';

      const addedProduct = await this.myProductsService.addProductAsync(this.product);
      if (addedProduct) {
        this.myProductsService.getStoreUpdateAdmin();
      }
      this.error = '';
      setTimeout(() => this.myRouter.navigateByUrl("/shop"), 1000);
    }
    catch (err) {
      this.error = "Please Try again later";
    }
  }

  public handleFileInput(files: FileList) {
    this.product.productImage = files.item(0);
    this.preview();
  }

  public preview() {
    // Show preview 
    const mimeType = this.product.productImage.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.product.productImage);
    reader.onload = (_event) => {
      this.previewImage = reader.result;
    }
  }

}
