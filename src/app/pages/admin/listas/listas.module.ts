import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListasRoutingModule } from './listas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { MaterialAppModule } from 'material-app.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxMaskModule } from 'ngx-mask';
import { HandleError } from 'app/utils/handleErrors';
import { SharedModule } from 'app/shared/shared.module';
import { MatSnackBarComponent } from 'app/shared/mat-snack-bar/mat-snack-bar.component';


@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    ListasRoutingModule,
    CommonModule,
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
    NgxMaskModule.forChild(),
  ],
  providers:[HandleError, MatSnackBarComponent]
})
export class ListasModule { }
