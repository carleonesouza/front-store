import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoExameDetailsComponent } from './tipo-exame-details/tipo-exame-details.component';
import { TipoExameListComponent } from './tipo-exame-list/tipo-exame-list.component';
import { TipoExameComponent } from './tipo-exame.component';

const routes: Routes = [
{
    path: '',
    component: TipoExameComponent,
    children: [
      {
        path: 'lista',
        component: TipoExameListComponent,
        children: [
          {
            path: ':id',
            component: TipoExameDetailsComponent,
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
export class TipoExameRoutingModule { }
