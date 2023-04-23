import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';

import { ServicesRoutingModule } from './services-routing.module';
import { ListServicesComponent } from './list-services/list-services.component';
import { ServicesDetailsComponent } from './services-details/services-details.component';
import { ServicesComponent } from './services.component';
import { ServicesService } from './services.service';
import { ServicesResolver } from './services.resolver';


@NgModule({
  declarations: [
    ServicesComponent,
    ListServicesComponent,
    ServicesDetailsComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    MaterialAppModule,
    SharedModule
  ],
  providers:[
    ServicesService,
    ServicesResolver
  ]
})
export class ServicesModule { }
