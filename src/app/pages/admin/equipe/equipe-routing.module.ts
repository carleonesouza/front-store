import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipeDetailsComponent } from './equipe-details/equipe-details.component';
import { EquipeComponent } from './equipe.component';
import { ListEquipesComponent } from './list-equipes/list-equipes.component';

const routes: Routes = [
  {
    path: '',
    component: EquipeComponent,
    children: [
      {
        path: 'lista',
        component: ListEquipesComponent,
        children: [
          {
            path: ':id',
            component: EquipeDetailsComponent,
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipeRoutingModule { }
