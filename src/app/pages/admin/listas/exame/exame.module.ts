import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExameRoutingModule } from './exame-routing.module';
import { ListExamesComponent } from './list-exames/list-exames.component';
import { ExameDetailsComponent } from './exame-details/exame-details.component';
import { ExameComponent } from './exame.component';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { ExameService } from './exame.service';
import { TipoExameService } from '../tipo-exame/tipo-exame.service';


@NgModule({
  declarations: [
    ListExamesComponent,
    ExameDetailsComponent,
    ExameComponent
  ],
  imports: [
    CommonModule,
    ExameRoutingModule,
    SharedModule,
    MaterialAppModule
  ],
  providers: [
    ExameService, TipoExameService
  ]
})
export class ExameModule { }
