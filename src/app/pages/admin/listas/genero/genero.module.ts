import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneroRoutingModule } from './genero-routing.module';
import { GeneroDetailsComponent } from './genero-details/genero-details.component';
import { ListGenerosComponent } from './list-generos/list-generos.component';
import { GeneroComponent } from './genero.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { MaterialAppModule } from 'material-app.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { GeneroService } from './genero.service';
import { SharedModule } from 'app/shared/shared.module';
import { GeneroResolver, GenerosResolver } from './genero.resolver';


@NgModule({
  declarations: [
    GeneroDetailsComponent,
    ListGenerosComponent,
    GeneroComponent,
  ],
  imports: [
    CommonModule,
    GeneroRoutingModule,
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
  providers:[GeneroService, GenerosResolver,GeneroResolver]
})
export class GeneroModule { }
