import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoExameRoutingModule } from './tipo-exame-routing.module';
import { TipoExameListComponent } from './tipo-exame-list/tipo-exame-list.component';
import { TipoExameDetailsComponent } from './tipo-exame-details/tipo-exame-details.component';
import { TipoExameComponent } from './tipo-exame.component';
import { SharedModule } from 'app/shared/shared.module';
import { TipoExameService } from './tipo-exame.service';
import { MaterialAppModule } from 'material-app.module';


@NgModule({
  declarations: [
    TipoExameListComponent,
    TipoExameDetailsComponent,
    TipoExameComponent,

  ],
  imports: [
    CommonModule,
    TipoExameRoutingModule,
    SharedModule,
    MaterialAppModule
  ],
  providers: [
    TipoExameService
  ]
})
export class TipoExameModule { }
