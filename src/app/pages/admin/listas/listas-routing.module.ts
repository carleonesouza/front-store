import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListasComponent } from './listas.component';

const routes: Routes = [
  {
    path: '',
    component: ListasComponent,
    children:[
      {
        path: 'cidade', loadChildren: () => import('app/pages/admin/listas/cidade/cidade.module').then(cidade => cidade.CidadeModule),
      },
      {
        path: 'escolaridade', loadChildren: () => import('app/pages/admin/listas/escolaridade/escolaridade.module').then(escolaridade => escolaridade.EscolaridadeModule),
      },
      {
        path: 'estado', loadChildren: () => import('app/pages/admin/listas/estado/estado.module').then(estado => estado.EstadoModule),
      },
      {
        path: 'genero', loadChildren: () => import('app/pages/admin/listas/genero/genero.module').then(genero => genero.GeneroModule),
      },
      {
        path: 'raca', loadChildren: () => import('app/pages/admin/listas/raca/raca.module').then(raca => raca.RacaModule),
      },
      {
        path: 'sexo', loadChildren: () => import('app/pages/admin/listas/sexo/sexo.module').then(sexo => sexo.SexoModule),
      },
      {
        path: 'documento', loadChildren: () => import('app/pages/admin/listas/tipo-documento/tipo-documento.module').then(tpDm => tpDm.TipoDocumentoModule),
      },
      {
        path: 'tipo-vinculo', loadChildren: () => import('app/pages/admin/listas/tipo-vinculo/tipo-vinculo.module').then(tpVm => tpVm.TipoVinculoModule),
      },
      {
        path: 'tipo-exame', loadChildren: () => import('app/pages/admin/listas/tipo-exame/tipo-exame.module').then(tpEx => tpEx.TipoExameModule),
      },
      {
        path: 'exame', loadChildren: () => import('app/pages/admin/listas/exame/exame.module').then(ex => ex.ExameModule),
      },
      {
        path: 'especialidade', loadChildren: () => import('app/pages/admin/listas/especialidades/especialidades.module').then(esp => esp.EspecialidadesModule),
      },
      {
        path: 'condicao-clinica', loadChildren: () => import('app/pages/admin/listas/condicao-clinica/condicao-clinica.module').then(condi => condi.CondicaoClinicaModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListasRoutingModule { }
