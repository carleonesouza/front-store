import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CondicaoClinicaDetailsComponent } from './condicao-clinica-details/condicao-clinica-details.component';
import { CondicaoClinicaListComponent } from './condicao-clinica-list/condicao-clinica-list.component';
import { CondicaoClinicaComponent } from './condicao-clinica.component';

const routes: Routes = [
  {
    path: '',
    component: CondicaoClinicaComponent,
    children: [
      {
        path: 'lista',
        component: CondicaoClinicaListComponent,
        children: [
          {
            path: ':id',
            component: CondicaoClinicaDetailsComponent,
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
export class CondicaoClinicaRoutingModule { }
