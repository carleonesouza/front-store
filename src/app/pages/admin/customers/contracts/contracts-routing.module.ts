import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractsComponent } from './contracts.component';
import { ContractResolver, ContractsResolver } from './contracts.resolver';
import { ContractDetailsComponent } from './details/contract-details.component';
import { ContractListComponent } from './list/contract-list.component';

const routes: Routes = [
  {
    path:'',
    component: ContractsComponent,
    children:[
        {
            path: 'lista',
            component: ContractListComponent,
            resolve: {
              task: ContractsResolver
            },
            children:[
              {
                path: ':id',
                component: ContractDetailsComponent,
                resolve: {
                  item: ContractResolver
                }
              }
            ]
          },
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractsRoutingModule { }
