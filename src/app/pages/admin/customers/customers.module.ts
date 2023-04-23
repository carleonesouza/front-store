import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers.routing';
import { ListCustomersComponent } from './list-customers/list-customers.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomersComponent } from './customers.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CustomersService } from './customers.service';
import { CustomerIdResolver, CustomersResolver } from './customers.resolver';
import { NgxMaskModule } from 'ngx-mask';
import { ContractsComponent } from './contracts/contracts.component';

@NgModule({
  declarations: [
    CustomersComponent,
    ListCustomersComponent,
    CustomerDetailsComponent,
    ContractsComponent,
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    FuseNavigationModule,
    SharedModule,
    FuseSplashScreenModule,
    NgApexchartsModule,
    FuseFindByKeyPipeModule,
    MaterialAppModule,
    FuseNavigationModule,
    FuseFindByKeyPipeModule,
    FuseAlertModule,
    NgxMaskModule.forChild()
  ],
  providers:[CustomersService, CustomersResolver, CustomerIdResolver]
})
export class CustomersModule { }
