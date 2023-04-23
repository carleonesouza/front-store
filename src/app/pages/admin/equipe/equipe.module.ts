import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquipeRoutingModule } from './equipe-routing.module';
import { EquipeDetailsComponent } from './equipe-details/equipe-details.component';
import { ListEquipesComponent } from './list-equipes/list-equipes.component';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { EquipeComponent } from './equipe.component';
import { EquipeService } from './equipe.service';


@NgModule({
  declarations: [
    ListEquipesComponent,
    EquipeDetailsComponent,
    EquipeComponent
  ],
  imports: [
    CommonModule,
    EquipeRoutingModule,
    SharedModule,
    MaterialAppModule
  ],
  providers: [
    EquipeService
  ]
})
export class EquipeModule { }
