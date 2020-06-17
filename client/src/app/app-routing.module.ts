import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { ShopComponent } from './components/shop/shop.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { OrderCompleteComponent } from './components/order-complete/order-complete.component';


const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "register", component: RegisterComponent },
  { path: "shop", component: ShopComponent },
  { path: "shop/check-out", component: CheckOutComponent },
  { path: "shop/thank-you", component: OrderCompleteComponent },
  { path: "admin", loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule) }, // Lazy Loading
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
