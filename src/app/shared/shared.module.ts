import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoComponent } from './logo-component/logo.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MaterialAppModule } from 'material-app.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { ListItemsComponent } from './list-items/list-items.component';
import { FuseCardModule } from '@fuse/components/card';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Error404Component } from './error/error-404/error-404.component';
import { Error401Component } from './error/error-401/error-401.component';
import { Error500Component } from './error/error-500/error-500.component';
import { ConfirmEqualValidatorDirective } from 'app/confirm-equal-validator.directive';
import { AddIdentificadorComponent } from './add-identificador/add-identificador.component';
import { DialogAssociateComponent } from './dialog-association/dialog-associate.component';
import { MatSnackBarComponent } from './mat-snack-bar/mat-snack-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        FuseAlertModule,
        MaterialAppModule,
        RouterModule,
        ReactiveFormsModule,
        FuseNavigationModule,
        FuseSplashScreenModule,
        NgApexchartsModule,
        FuseFindByKeyPipeModule,
        MaterialAppModule,
        FuseNavigationModule,
        FuseFindByKeyPipeModule,
        FuseAlertModule,
        FuseCardModule,
        FormsModule,
        MatSnackBarModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LogoComponent,
        ListItemsComponent,
        Error404Component,
        Error500Component,
        Error401Component,
        ConfirmEqualValidatorDirective,
        AddIdentificadorComponent,
        DialogAssociateComponent,
        MatSnackBarComponent,

        //IndividuoProgramaSaudeComponent
    ],
    declarations:[
        LogoComponent,
        ConfirmationDialogComponent,
        NotFoundComponent,
        Error404Component,
        Error500Component,
        Error401Component,
        ListItemsComponent,
        ConfirmEqualValidatorDirective,
        AddIdentificadorComponent,
        DialogAssociateComponent,
        MatSnackBarComponent,
        //IndividuoProgramaSaudeComponent
    ]
})
export class SharedModule
{
}
