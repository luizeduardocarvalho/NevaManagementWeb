import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductListComponent } from './product-list.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { ProductRoutingModule } from './product-routing.module';
import { AddQuantityComponent } from './add-quantity/add-quantity.component';
import { UseProductComponent } from './use-product/use-product.component';
import { ProductComponent } from './product.component';


@NgModule({
  declarations: [
    ProductComponent,
    ProductListComponent,
    ProductCardComponent,
    AddProductComponent,
    EditProductComponent,
    ProductInfoComponent,
    AddQuantityComponent,
    UseProductComponent
  ],
  imports: [
    ProductRoutingModule,
    SharedModule
  ]
})
export class ProductModule { }
