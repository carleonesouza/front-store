import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndividuosResolver, IndividuoResolver } from 'app/pages/admin/individuos/individuos.resolver';
import { CanDeactivateIndividuoDetails } from 'app/pages/admin/individuos/individuos.guard';
import { IndividuosDetailsComponent } from './individuos-details/individuos-details.component';
import { ListIndividuosComponent } from './list-individuos/list-individuos.component';
import { IndividuosComponent } from './individuos.component';

const routes: Routes = [
  {
    path: '',
    component: IndividuosComponent,
    children: [
      {
        path: 'lista',
        component: ListIndividuosComponent,
        resolve: {
          task: IndividuosResolver
        }
      },
      {
        path: 'lista/:id',
        component: IndividuosDetailsComponent,
        resolve: {
          task: IndividuoResolver,
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndividuosRoutingModule { }
