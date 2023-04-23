import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoVinculoRoutingModule } from './tipo-vinculo-routing.module';
import { TipoVinculoComponent } from './tipo-vinculo.component';
import { VinculoListComponent } from './vinculo-list/vinculo-list.component';
import { VinculoDetailsComponent } from './vinculo-details/vinculo-details.component';
import { TipoVinculoService } from './tipo-vinculo.service';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { TiposVinculoResolver, TipoVinculoResolver } from './tipo-vinculo.resolver';
import { HandleError } from 'app/utils/handleErrors';


@NgModule({
  declarations: [
    TipoVinculoComponent,
    VinculoListComponent,
    VinculoDetailsComponent
  ],
  imports: [
    CommonModule,
    TipoVinculoRoutingModule,
    SharedModule,
    MaterialAppModule
  ],
  providers: [
    TipoVinculoService, TiposVinculoResolver, TipoVinculoResolver, HandleError
  ]
})
export class TipoVinculoModule { }
