import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExameDetailsComponent } from './exame-details/exame-details.component';
import { ExameComponent } from './exame.component';
import { ListExamesComponent } from './list-exames/list-exames.component';

const routes: Routes = [
  {
    path: '',
    component: ExameComponent,
    children: [
      {
        path: 'lista',
        component: ListExamesComponent,
        children: [
          {
            path: ':id',
            component: ExameDetailsComponent,
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
export class ExameRoutingModule { }
