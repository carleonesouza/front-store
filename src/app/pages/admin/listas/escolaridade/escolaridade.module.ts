import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EscolaridadeRoutingModule } from './escolaridade-routing.module';
import { EscolaridadeComponent } from './escolaridade.component';
import { ListEscolaridadeComponent } from './list-escolaridades/list-escolaridades.component';
import { EscolaridadeDetailsComponent } from './escolaridade-details/escolaridade-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { MaterialAppModule } from 'material-app.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EscolaridadeService } from './escolaridade.service';
import { EscolaridadeResolver, EscolaridadesResolver } from './escolaridade.resolver';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    EscolaridadeComponent,
    ListEscolaridadeComponent,
    EscolaridadeDetailsComponent
  ],
  imports: [
    CommonModule,
    EscolaridadeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FuseNavigationModule,
    FuseSplashScreenModule,
    NgApexchartsModule,
    FuseFindByKeyPipeModule,
    SharedModule,
    MaterialAppModule,
    FuseNavigationModule,
    FuseFindByKeyPipeModule,
    FuseAlertModule,
    FuseCardModule,
  ],
  providers:[EscolaridadeService, EscolaridadesResolver, EscolaridadeResolver]
})
export class EscolaridadeModule { }
