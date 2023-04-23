import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomersComponent } from './customers.component';
import { CustomerIdResolver, CustomersResolver } from './customers.resolver';
import { ListCustomersComponent } from './list-customers/list-customers.component';

const routes: Routes = [
  {
      path:'',
      component: CustomersComponent,
      children:[
          {
              path: 'lista',
              component: ListCustomersComponent,
              resolve: {
                task: CustomersResolver
              },
              children:[
                {
                  path: ':id',
                  resolve:{
                    item: CustomerIdResolver
                  },
                  component: CustomerDetailsComponent,
                }
              ]
            },
            // {
            //   path: 'contrato', loadChildren:() => import('app/pages/admin/customers/contracts/contracts.module').then(contracts => contracts.ContractsModule),
            // }
      ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
