import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoDocumentoRoutingModule } from './tipo-documento-routing.module';
import { TipoDocumentoDetailsComponent } from './tipo-documento-details/tipo-documento-details.component';
import { TipoDocumentoListComponent } from './tipo-documento-list/tipo-documento-list.component';
import { TipoDocumentoComponent } from './tipo-documento.component';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { TipoDocumentoService } from './tipo-documento.service';


@NgModule({
  declarations: [
    TipoDocumentoComponent,
    TipoDocumentoListComponent,
    TipoDocumentoDetailsComponent
  ],
  imports: [
    CommonModule,
    TipoDocumentoRoutingModule,
    MaterialAppModule,
    SharedModule,
  ],
  providers:[
    TipoDocumentoService
  ]
})
export class TipoDocumentoModule { }
