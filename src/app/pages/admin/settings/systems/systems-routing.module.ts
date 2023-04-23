import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSystemsComponent } from './list-systems/list-systems.component';
import { SystemDetailsComponent } from './system-details/system-details.component';
import { SettingsSystemsComponent } from './systems.component';
import { SystemIdResolver, SystemsResolver } from './systems.resolver';

const routes: Routes = [
  {
    path: '',
    component: SettingsSystemsComponent,
    children: [
      {
        path: 'lista', component: ListSystemsComponent,
        resolve:{
          task: SystemsResolver
        },
        children:[
          {
            path:':id',
            component: SystemDetailsComponent,
            resolve:{
              task: SystemIdResolver
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
export class SystemsRoutingModule { }
