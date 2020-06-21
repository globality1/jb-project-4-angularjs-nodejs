import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
import { CategoriesModel } from 'src/app/models/categories-model';
import { store } from 'src/app/redux/store';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { FieldValidationService } from 'src/app/services/field-validations';

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

  constructor(private myProductsService: ProductsService, private myRouter: Router, private myAuthService: AuthService, private myFieldValidationsService: FieldValidationService) { }

  ngOnInit(): void {
    store.subscribe(() => {
      this.categories = store.getState().shopCategories;
    })
    this.categories = store.getState().shopCategories;
  }

  public async addProduct(addProductForm: NgForm) {
    try {

      // check name is valid
      if (this.product.productName.length < 3 || this.product.productName.length > 40) {
        addProductForm.controls['productName'].setErrors({ 'invalid': true });
        return;
      }
      addProductForm.controls['productName'].setErrors({ 'invalid': false });
      addProductForm.controls['productName'].disable();

      // check price is valid
      if (this.product.productPrice <= 0 || this.product.productPrice > 10000) {
        addProductForm.controls['productPrice'].setErrors({ 'invalid': true });
        return;
      }
      addProductForm.controls['productPrice'].setErrors({ 'invalid': false });
      addProductForm.controls['productPrice'].disable();

      // check cateory is correct
      if (!this.myFieldValidationsService.categoryValidation(this.categories, this.product.productCategoryId)) {
        addProductForm.controls['productCategory'].setErrors({ 'invalid': true });
        return;
      }
      addProductForm.controls['productCategory'].setErrors({ 'invalid': false });
      addProductForm.controls['productCategory'].disable();

      // check cateory is correct
      if (!this.product.productImage) {
        this.error = "file is missing"
        return;
      }

      // check file is in correct size
      if (this.product.productImage) {
        if (this.product.productImage.size > 1000000) {
          this.error = "Max File size is 1 mb"
          return;
        }
      }
      this.error = '';

      // create new product
      await this.myProductsService.addProductAsync(this.product);

      // emit of socket for the new updated product
      store.getState().socket.emit("update-from-app", 'Success');
      // redirect back to admin
      setTimeout(() => this.myRouter.navigateByUrl("/admin"), 1000);
    }
    catch (err) {
      this.error = "Please Try again later";
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
