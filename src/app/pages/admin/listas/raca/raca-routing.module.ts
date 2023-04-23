import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRacasComponent } from './list-racas/list-racas.component';
import { RacaDetailsComponent } from './raca-details/raca-details.component';
import { RacaResolver, RacasResolver } from './raca.resolver';
import { RacaComponent } from './raca.component';

const routes: Routes = [
  {
    path: '',
    component: RacaComponent,
    children: [
      {
        path: 'lista',
        component: ListRacasComponent,
        resolve: {
          task: RacasResolver
        },
        children: [
          {
            path: ':id',
            component: RacaDetailsComponent,
            resolve:{
              task: RacaResolver
            }
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
export class RacaRoutingModule { }
