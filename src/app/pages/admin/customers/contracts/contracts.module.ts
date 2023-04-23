import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxMaskModule } from 'ngx-mask';


import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractListComponent } from './list/contract-list.component';
import { ContractDetailsComponent } from './details/contract-details.component';
import { ContractsService } from './contracts.service';
import { ContractResolver, ContractsResolver } from './contracts.resolver';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ProductsService } from '../../products/products.service';


@NgModule({
  declarations: [
    ContractListComponent,
    ContractDetailsComponent
  ],
  imports: [
    CommonModule,
    ContractsRoutingModule,
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
  providers:[{ provide: MAT_DATE_LOCALE, useValue: 'pt-br' },{
    provide: MAT_DATE_FORMATS,
    useValue: {
      display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      }
    }
  },
    ContractsService,
    ContractResolver,
    ContractsResolver,
    ProductsService
  ]
})
export class ContractsModule { }
