import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { ActivatedRoute, Router } from '@angular/router';
import { store } from 'src/app/redux/store';
import { CategoriesModel } from 'src/app/models/categories-model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  public product = new ProductModel;
  public id: number;
  public categories: CategoriesModel[];
  public error: string;
  public previewImage: any = null;

  constructor(private myActivatedRoute: ActivatedRoute, private myProductsService: ProductsService, private myRouter: Router) {
    // disabled issue when moving from one item to another, without this the view doesn't change on route because it's using same route nd just the id changes
    this.myRouter.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {
    this.id = +this.myActivatedRoute.snapshot.params.id;
    try {
      this.product = await this.myProductsService.getOneProductAsync(this.id);
      this.categories = store.getState().shopCategories;
    }
    catch (err) {
      this.error = err.message
    }
  }

  public async editProduct() {
    try {
      if (this.product.productPrice <= 0) {
        this.product.productPrice = 0;
        return;
      }
      if (this.product.productName.length < 2 || this.product.productCategoryId <= 0) {
        this.error = "Fields can't be empty"
        return;
      }
      this.error = '';
      if (this.product.productImage) {
        if (this.product.productImage.size > 1000000) {
          this.error = "Max File size is 1 mb"
        }
      }
      this.error = '';

      const updatedProduct = await this.myProductsService.updateProductAsync(this.product);
      if (updatedProduct) {
        this.myProductsService.getStoreUpdateAdmin();
      }
      this.error = '';
      setTimeout(() => this.myRouter.navigateByUrl("/shop"), 1000);
    }
    catch (err) {
      this.error = "Please Try again";
      console.log(err);
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
