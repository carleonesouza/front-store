import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { MaterialAppModule } from 'material-app.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CidadeRoutingModule } from './cidade-routing.module';
import { SharedModule } from 'app/shared/shared.module';

import { ListCidadesComponent } from './list-cidades/list-cidades.component';
import { CidadeDetailsComponent } from './cidade-details/cidade-details.component';
import { CidadeComponent } from './cidade.component';
import { CidadeService } from './cidade.service';
import { HandleError } from 'app/utils/handleErrors';
import { CidadeResolver, CidadesResolver } from './cidade.resolver';
import { MatSnackBarComponent } from 'app/shared/mat-snack-bar/mat-snack-bar.component';





@NgModule({
  declarations: [
    CidadeComponent,
    CidadeDetailsComponent,
    ListCidadesComponent,
  ],
  imports: [
    CommonModule,
    CidadeRoutingModule,
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
  providers:[
    CidadeService, HandleError, CidadeResolver, CidadesResolver, MatSnackBarComponent
  ]
})
export class CidadeModule { }
