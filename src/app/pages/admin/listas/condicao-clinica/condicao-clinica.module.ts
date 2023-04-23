import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';

import { CondicaoClinicaRoutingModule } from './condicao-clinica-routing.module';
import { CondicaoClinicaDetailsComponent } from './condicao-clinica-details/condicao-clinica-details.component';
import { CondicaoClinicaListComponent } from './condicao-clinica-list/condicao-clinica-list.component';
import { CondicaoClinicaComponent } from './condicao-clinica.component';
import { CondicaoClinicaService } from './condicao-clinica.service';



@NgModule({
  declarations: [
    CondicaoClinicaComponent,
    CondicaoClinicaListComponent,
    CondicaoClinicaDetailsComponent,
  ],
  imports: [
    CommonModule,
    CondicaoClinicaRoutingModule,
    MaterialAppModule,
    SharedModule,
  ],
  providers: [
    CondicaoClinicaService
  ]
})
export class CondicaoClinicaModule { }
