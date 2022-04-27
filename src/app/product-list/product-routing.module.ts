import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { AddQuantityComponent } from './add-quantity/add-quantity.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { ProductListComponent } from './product-list.component';
import { ProductComponent } from './product.component';
import { UseProductComponent } from './use-product/use-product.component';

const routes: Routes = [
  { 
    path: '', 
    component: ProductComponent, 
    children: [
      { path: '', component: ProductListComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: ':id/info', component: ProductInfoComponent},
      { path: ':id/add-quantity', component: AddQuantityComponent},
      { path: ':id/use-product', component: UseProductComponent},
      { path: ':id/edit', component: EditProductComponent },
      { path: ':id', component: ProductCardComponent},
    ] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
