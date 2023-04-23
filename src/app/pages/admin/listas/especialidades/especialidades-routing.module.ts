import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspecialidadesDetailsComponent } from './especialidades-details/especialidades-details.component';
import { EspecialidadesComponent } from './especialidades.component';
import { ListEspecialidadesComponent } from './list-especialidades/list-especialidades.component';

const routes: Routes = [
  {
    path: '',
    component: EspecialidadesComponent,
    children: [
      {
        path: 'lista',
        component: ListEspecialidadesComponent,
        children: [
          {
            path: ':id',
            component: EspecialidadesDetailsComponent,
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
export class EspecialidadesRoutingModule { }
