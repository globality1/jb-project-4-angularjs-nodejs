import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { Routes, RouterModule } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductCardComponentAdmin } from './product-card-admin/product-card-admin.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { ProductsComponentAdmin } from './products-admin/products-admin.component';


const adminRoutes: Routes = [
    {
        path: "", component: AdminComponent, children: [ // "/admin" (because it is relative to the route in app-routing)
            { path: "add", component: AddProductComponent }, // "/admin/add"
            { path: "edit/:id", component: EditProductComponent }, // "/admin/edit"
            { path: "", redirectTo: "", pathMatch: "full" },
            { path: "**", component: AdminComponent }
        ]
    },
];

@NgModule({
    declarations: [
        AdminComponent, 
        AddProductComponent, 
        EditProductComponent, 
        ProductsComponentAdmin, 
        ProductCardComponentAdmin],
    imports: [
        CommonModule, 
        RouterModule.forChild(adminRoutes), 
        NgbModule, 
        FormsModule, 
        MatButtonModule, 
        MatInputModule],
    bootstrap: [
        AdminComponent]
})
export class AdminModule { }
