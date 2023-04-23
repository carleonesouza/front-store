import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ListProductsComponent } from './list-products/list-products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsComponent } from './products.component';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { ProductsService } from './products.service';
import { ProductResolver, ProductsResolver } from './products.resolver';


@NgModule({
  declarations: [
    ListProductsComponent,
    ProductDetailsComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    MaterialAppModule,
  ],
  providers:[
    ProductsService,
    ProductsResolver,
    ProductResolver
  ]
})
export class ProductsModule { }
