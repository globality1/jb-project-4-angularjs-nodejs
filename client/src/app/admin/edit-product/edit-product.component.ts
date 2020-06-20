import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { ActivatedRoute, Router } from '@angular/router';
import { store } from 'src/app/redux/store';
import { CategoriesModel } from 'src/app/models/categories-model';
import { ProductsService } from 'src/app/services/products.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { FieldValidationService } from 'src/app/services/field-validations';

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

  constructor(private myActivatedRoute: ActivatedRoute, private myProductsService: ProductsService, private myRouter: Router, private myAuthService: AuthService, private myFieldValidationsService: FieldValidationService) {
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

  public async editProduct(editProductForm: NgForm) {
    try {
      // check name is valid
      if (this.product.productName.length < 3 || this.product.productName.length > 40) {
        editProductForm.controls['productName'].setErrors({ 'invalid': true });
        return;
      }
      editProductForm.controls['productName'].setErrors({ 'invalid': false });
      editProductForm.controls['productName'].disable();

      // check price is valid
      if (this.product.productPrice <= 0 || this.product.productPrice > 10000) {
        editProductForm.controls['productPrice'].setErrors({ 'invalid': true });
        return;
      }
      editProductForm.controls['productPrice'].setErrors({ 'invalid': false });
      editProductForm.controls['productPrice'].disable();

      // check cateory is correct and is real from the category array
      if (!this.myFieldValidationsService.categoryValidation(this.categories, this.product.productCategoryId)) {
        editProductForm.controls['productCategory'].setErrors({ 'invalid': true });
        return;
      }
      editProductForm.controls['productCategory'].setErrors({ 'invalid': false });
      editProductForm.controls['productCategory'].disable();

      // check image file exist, if yes, check it's it size limit
      if (this.product.productImage) {
        if (this.product.productImage.size > 1000000) {
          this.error = "Max File size is 1 mb"
          return;
        }
      }
      this.error = '';

      // update product
      await this.myProductsService.updateProductAsync(this.product);

      store.getState().socket.emit("update-from-app", 'Success');
      // redirect back to admin
      setTimeout(() => this.myRouter.navigateByUrl("/admin"), 1000);
    }
    catch (err) {
      // this.error = "Please Try again";
      this.error = err.message;
      // logs out client if jwt token has timed out
      if (err.status === 401) {
        const response = await this.myAuthService.logout();
        // if logout successful, log redirect to home
        if (response) {
          setTimeout(() => this.myRouter.navigateByUrl("/home"), 300);
          return
        }
      }
    }
  }

  // extracts files for preview
  public handleFileInput(files: FileList) {
    this.product.productImage = files.item(0);
    this.preview();
  }

  public preview() {
    // check type is image
    const mimeType = this.product.productImage.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // reads uploaded file and sets to previs
    const reader = new FileReader();
    reader.readAsDataURL(this.product.productImage);
    reader.onload = (_event) => {
      this.previewImage = reader.result;
    }
  }

}
