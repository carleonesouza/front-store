import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramaClienteRoutingModule } from './programa-cliente-routing.module';
import { ProgramaClienteDetailsComponent } from './programa-cliente-details/programa-cliente-details.component';
import { ProgramaClienteListComponent } from './programa-cliente-list/programa-cliente-list.component';
import { ProgramaClienteComponent } from './programa-cliente.component';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { ProgramaClienteService } from './programa-cliente.service';
import { ProgramaClienteResolver, ProgramasClienteResolver } from './programa-cliente.resolver';


@NgModule({
  declarations: [
    ProgramaClienteComponent,
    ProgramaClienteListComponent,
    ProgramaClienteDetailsComponent,
  ],
  imports: [
    CommonModule,
    ProgramaClienteRoutingModule,
    SharedModule,
    MaterialAppModule
  ],
  providers: [
    ProgramaClienteService, ProgramaClienteResolver, ProgramasClienteResolver
  ]
})
export class ProgramaClienteModule { }
