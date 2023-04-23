import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadoDetailsComponent } from './estado-details/estado-details.component';
import { EstadoComponent } from './estado.component';
import { EstadoResolver, EstadosResolver } from './estado.resolver';
import { ListEstadosComponent } from './list-estados/list-estados.component';

const routes: Routes = [
  {
    path:'',
    component: EstadoComponent,
    children:[
        {
            path: 'lista',
            component: ListEstadosComponent,
            resolve: {
              task: EstadosResolver
            },
            children:[
              {
                path: ':id',
                component: EstadoDetailsComponent,
                resolve: {
                  task: EstadoResolver
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
export class EstadoRoutingModule { }
