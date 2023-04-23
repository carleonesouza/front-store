import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListServicesComponent } from './list-services/list-services.component';
import { ServicesDetailsComponent } from './services-details/services-details.component';
import { ServicesComponent } from './services.component';
import { ServicesResolver } from './services.resolver';

const routes: Routes = [
  {
    path: '',
    component: ServicesComponent,
    children: [
      {
        path: 'services',
        component: ListServicesComponent,
        resolve:{},
        children: [
          {
            path: ':id',
            component: ServicesDetailsComponent,
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
export class ServicesRoutingModule { }
