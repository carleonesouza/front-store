import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SexoRoutingModule } from './sexo-routing.module';
import { ListSexosComponent } from './list-sexos/list-sexos.component';
import { SexoDetailsComponent } from './sexo-details/sexo-details.component';
import { SexoComponent } from './sexo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SexoResolver, SexosResolver } from './sexo.resolver';
import { SexoService } from './sexo.service';


@NgModule({
  declarations: [
    SexoComponent,
    ListSexosComponent,
    SexoDetailsComponent,
  ],
  imports: [
    CommonModule,
    SexoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FuseNavigationModule,
    FuseSplashScreenModule,
    NgApexchartsModule,
    FuseFindByKeyPipeModule,
    MaterialAppModule,
    SharedModule,
    FuseNavigationModule,
    FuseFindByKeyPipeModule,
    FuseAlertModule,
    FuseCardModule,
  ],
  providers:[SexoService, SexosResolver, SexoResolver]
})
export class SexoModule { }
