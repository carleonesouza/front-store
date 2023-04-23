import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EspecialidadesRoutingModule } from './especialidades-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { ListEspecialidadesComponent } from './list-especialidades/list-especialidades.component';
import { EspecialidadesDetailsComponent } from './especialidades-details/especialidades-details.component';
import { EspecialidadesComponent } from './especialidades.component';
import { EspecialidadesService } from './especialidades.service';


@NgModule({
  declarations: [
    ListEspecialidadesComponent,
    EspecialidadesDetailsComponent,
    EspecialidadesComponent
  ],
  imports: [
    CommonModule,
    EspecialidadesRoutingModule,
    SharedModule,
    MaterialAppModule
  ],
  providers:[
    EspecialidadesService
  ]
})
export class EspecialidadesModule { }
