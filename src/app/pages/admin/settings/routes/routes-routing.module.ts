import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRoutesComponent } from './list-routes/list-routes.component';
import { RoutesDetailsComponent } from './routes-details/routes-details.component';
import { SettingsRoutesComponent } from './routes.component';
import { RoutesIdResolver, RoutesResolver } from './routes.resolver';

const routes: Routes = [
  {
    path: '',
    component: SettingsRoutesComponent,
    children: [
      {
        path: 'lista', component: ListRoutesComponent,
        resolve:{
          routes: RoutesResolver},
        children:[
          {
            path:':id',
            component: RoutesDetailsComponent,
            resolve:{
              task: RoutesIdResolver
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
export class RoutesRoutingModule { }
