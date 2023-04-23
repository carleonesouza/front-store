import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneroDetailsComponent } from './genero-details/genero-details.component';
import { GeneroComponent } from './genero.component';
import { GeneroResolver, GenerosResolver } from './genero.resolver';
import { ListGenerosComponent } from './list-generos/list-generos.component';

const routes: Routes = [
  {
    path:'',
    component: GeneroComponent,
    children:[
        {
            path: 'lista',
            component: ListGenerosComponent,
            resolve: {
              task: GenerosResolver
            },
            children:[
              {
                path: ':id',
                component: GeneroDetailsComponent,
                resolve: {
                  task: GeneroResolver
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
export class GeneroRoutingModule { }
