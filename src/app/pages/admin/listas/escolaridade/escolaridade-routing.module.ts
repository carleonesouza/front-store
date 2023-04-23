import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EscolaridadeDetailsComponent } from './escolaridade-details/escolaridade-details.component';
import { EscolaridadeComponent } from './escolaridade.component';
import { EscolaridadeResolver, EscolaridadesResolver } from './escolaridade.resolver';
import { ListEscolaridadeComponent } from './list-escolaridades/list-escolaridades.component';

const routes: Routes = [
  {
    path:'',
    component: EscolaridadeComponent,
    children:[
        {
            path: 'lista',
            component: ListEscolaridadeComponent,
            resolve: {
              task: EscolaridadesResolver
            },
            children:[
              {
                path: ':id',
                component: EscolaridadeDetailsComponent,
                resolve: {
                  task: EscolaridadeResolver
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
export class EscolaridadeRoutingModule { }
