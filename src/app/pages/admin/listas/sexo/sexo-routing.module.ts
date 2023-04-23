import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSexosComponent } from './list-sexos/list-sexos.component';
import { SexoDetailsComponent } from './sexo-details/sexo-details.component';
import { SexoComponent } from './sexo.component';
import { SexoResolver, SexosResolver } from './sexo.resolver';

const routes: Routes = [
  {
    path: '',
    component: SexoComponent,
    children: [
      {
        path: 'lista',
        component: ListSexosComponent,
        resolve: {
          task: SexosResolver
        },
        children: [
          {
            path: ':id',
            component: SexoDetailsComponent,
            resolve:{
              data: SexoResolver
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
export class SexoRoutingModule { }
