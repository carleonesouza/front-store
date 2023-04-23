import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RacaRoutingModule } from './raca-routing.module';
import { RacaDetailsComponent } from './raca-details/raca-details.component';
import { ListRacasComponent } from './list-racas/list-racas.component';
import { RacaComponent } from './raca.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RacaService } from './raca.service';
import { RacaResolver, RacasResolver } from './raca.resolver';


@NgModule({
  declarations: [
    RacaDetailsComponent,
    ListRacasComponent,
    RacaComponent
  ],
  imports: [
    CommonModule,
    RacaRoutingModule,
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
  providers: [RacaService, RacasResolver, RacaResolver]
})
export class RacaModule { }
