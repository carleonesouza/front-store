import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndividuosRoutingModule } from './individuos-routing.module';
import { IndividuosDetailsComponent } from './individuos-details/individuos-details.component';
import { ListIndividuosComponent } from './list-individuos/list-individuos.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { MaterialAppModule } from 'material-app.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxMaskModule } from 'ngx-mask';
import { IndividuosService } from './individuos.service';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { IndividuoResolver, IndividuosResolver } from 'app/pages/admin/individuos/individuos.resolver';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseCardModule } from '@fuse/components/card';
import { CpfValidatorDirective } from 'app/cpf-validator.directive';
import { SharedModule } from 'app/shared/shared.module';
import { ContractsService } from '../customers/contracts/contracts.service';
import { MatSnackBarComponent } from 'app/shared/mat-snack-bar/mat-snack-bar.component';


@NgModule({
  declarations: [
    IndividuosDetailsComponent,
    ListIndividuosComponent,
    CpfValidatorDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FuseNavigationModule,
    FuseSplashScreenModule,
    NgApexchartsModule,
    FuseFindByKeyPipeModule,
    MaterialAppModule,
    FuseNavigationModule,
    SharedModule,
    FuseFindByKeyPipeModule,
    FuseAlertModule,
    FuseCardModule,
    IndividuosRoutingModule,
    NgxMaskModule.forChild(),
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-br' },{
    provide: MAT_DATE_FORMATS,
    useValue: {
      display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      }
    }
  }, IndividuosService, IndividuoResolver, IndividuosResolver, ContractsService, MatSnackBarComponent]
})
export class IndividuosModule { }
