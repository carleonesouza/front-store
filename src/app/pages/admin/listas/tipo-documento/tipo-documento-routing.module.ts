import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoDocumentoDetailsComponent } from './tipo-documento-details/tipo-documento-details.component';
import { TipoDocumentoListComponent } from './tipo-documento-list/tipo-documento-list.component';
import { TipoDocumentoComponent } from './tipo-documento.component';

const routes: Routes = [
  {
    path: '',
    component: TipoDocumentoComponent,
    children: [
      {
        path: 'lista',
        component: TipoDocumentoListComponent,
        children: [
          {
            path: ':id',
            component: TipoDocumentoDetailsComponent,
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
export class TipoDocumentoRoutingModule { }
