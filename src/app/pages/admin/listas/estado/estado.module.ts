import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadoRoutingModule } from './estado-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { MaterialAppModule } from 'material-app.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EstadoComponent } from './estado.component';
import { EstadoDetailsComponent } from './estado-details/estado-details.component';
import { ListEstadosComponent } from './list-estados/list-estados.component';
import { EstadoService } from './estado.service';
import { EstadoResolver, EstadosResolver } from './estado.resolver';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    ListEstadosComponent,
    EstadoDetailsComponent,
    EstadoComponent
  ],
  imports: [
    CommonModule,
    EstadoRoutingModule,
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
  providers: [EstadoService, EstadosResolver, EstadoResolver]
})
export class EstadoModule { }
