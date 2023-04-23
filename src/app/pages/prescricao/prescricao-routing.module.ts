import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrescricaoComponent } from './prescricao.component';

const routes: Routes = [
  {path: 'prescricao', component: PrescricaoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrescricaoRoutingModule { }
