import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CidadeDetailsComponent } from './cidade-details/cidade-details.component';
import { CidadeComponent } from './cidade.component';
import { CidadeResolver, CidadesResolver } from './cidade.resolver';
import { ListCidadesComponent } from './list-cidades/list-cidades.component';


const routes: Routes = [
        {
            path:'',
            component: CidadeComponent,
            children:[
                {
                    path: 'lista',
                    component: ListCidadesComponent,
                    resolve: {
                      task: CidadesResolver},
                    children:[
                      {
                        path: ':id',
                        component: CidadeDetailsComponent,
                        resolve:{
                          task: CidadeResolver
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
export class CidadeRoutingModule { }
