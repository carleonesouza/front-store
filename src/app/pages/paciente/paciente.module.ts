import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PacienteRoutingModule } from './paciente-routing.module';
import { HomunculoComponent } from './homunculo/homunculo.component';
import { RiscosGeraisComponent } from './riscos-gerais/riscos-gerais.component';
import { SaudeIndividuoComponent } from './saude-individuo/saude-individuo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  declarations: [
    HomunculoComponent,
    RiscosGeraisComponent,
    SaudeIndividuoComponent
  ],
  imports: [
    CommonModule,
    PacienteRoutingModule,
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
  ]
})
export class PacienteModule { }
