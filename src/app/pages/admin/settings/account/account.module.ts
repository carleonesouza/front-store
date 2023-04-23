import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { ListAccountsComponent } from './list-accounts/list-accounts.component';
import { AccountService } from './account.service';
import { AccountResolver, AccountsResolver } from './account.resolver';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxMaskModule } from 'ngx-mask';
import { IndividuosRoutingModule } from '../../individuos/individuos-routing.module';
import { SettingsAccountComponent } from './account.component';
import { RolesService } from '../roles/roles.service';
import { RolesResolver } from '../roles/roles.resolver';
import { ContractsService } from '../../customers/contracts/contracts.service';


@NgModule({
  declarations: [
    ListAccountsComponent,
    AccountDetailsComponent,
    SettingsAccountComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
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
  providers:[AccountService, AccountsResolver, AccountResolver,
     RolesService, RolesResolver, ContractsService]
})
export class AccountModule { }
