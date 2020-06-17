import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { SystemInformationComponent } from './components/system-information/system-information.component';
import { ProductsComponent } from './components/products/products.component';
import { RegisterComponent } from './components/register/register.component';
import { AboutShopComponent } from './components/about-shop/about-shop.component';
import { ShopComponent } from './components/shop/shop.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { OrderCompleteComponent } from './components/order-complete/order-complete.component';
import { OrderComponent } from './components/order-details/order-details.component';
import { highlightValuePipe } from './pipes/highlightValue.pipe';
import { SplitterModule } from '@syncfusion/ej2-angular-layouts';


@NgModule({
  declarations: [
    LayoutComponent,
    LoginComponent,
    HomeComponent,
    PageNotFoundComponent,
    HeaderComponent,
    FooterComponent,
    SystemInformationComponent,
    ProductsComponent,
    RegisterComponent,
    AboutShopComponent,
    ShopComponent,
    CartComponent,
    ProductCardComponent,
    CartItemComponent,
    CheckOutComponent,
    OrderCompleteComponent,
    OrderComponent,
    highlightValuePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    SplitterModule
  ],
  providers: [],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
