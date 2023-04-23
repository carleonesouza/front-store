import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramaClienteDetailsComponent } from './programa-cliente-details/programa-cliente-details.component';
import { ProgramaClienteListComponent } from './programa-cliente-list/programa-cliente-list.component';
import { ProgramaClienteComponent } from './programa-cliente.component';
import { ProgramaClienteResolver, ProgramasClienteResolver } from './programa-cliente.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProgramaClienteComponent,
    children: [
      {
        path: 'lista',
        component: ProgramaClienteListComponent,
        resolve: {
          task: ProgramasClienteResolver
        },
        children: [
          {
            path: ':id',
            component: ProgramaClienteDetailsComponent,
            resolve: {
              task: ProgramaClienteResolver
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
export class ProgramaClienteRoutingModule { }
