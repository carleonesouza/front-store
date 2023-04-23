import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoVinculoComponent } from './tipo-vinculo.component';
import { TiposVinculoResolver, TipoVinculoResolver } from './tipo-vinculo.resolver';
import { VinculoDetailsComponent } from './vinculo-details/vinculo-details.component';
import { VinculoListComponent } from './vinculo-list/vinculo-list.component';

const routes: Routes = [
  {
    path: '',
    component: TipoVinculoComponent,
    children: [
      {
        path: 'lista',
        component: VinculoListComponent,
        resolve: {
          task: TiposVinculoResolver
        },
        children: [
          {
            path: ':id',
            component: VinculoDetailsComponent,
            resolve: {
              item: TipoVinculoResolver
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
export class TipoVinculoRoutingModule { }
